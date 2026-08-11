// ============================================================
// Shared Telegram InitData validator for Supabase Edge Functions
// Implements Telegram Mini Apps security spec (HMAC-SHA256),
// using Web Crypto (crypto.subtle) so it runs in Deno (Edge).
// ============================================================

export interface ValidatedTelegramData {
  userId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  authDate: number;
  startParam?: string;
  queryId?: string;
  chatInstance?: string;
  chatType?: string;
  canSendAfter?: number;
}

export interface ValidationResult {
  valid: boolean;
  data: ValidatedTelegramData | null;
  error: string | null;
  age: number;
}

const MAX_AGE_SECONDS = 86400; // 24h

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: ArrayBuffer, data: string | Uint8Array): Promise<ArrayBuffer> {
  const crypto = globalThis.crypto as Crypto;
  const payload =
    typeof data === 'string'
      ? new TextEncoder().encode(data)
      : data;
  return crypto.subtle.sign(
    { name: 'HMAC', hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    payload,
  );
}

/**
 * Validate a Telegram WebApp initData string against a bot token.
 * Returns the parsed user/validated data on success.
 */
export async function validateTelegramInitData(
  initData: string,
  botToken: string,
): Promise<ValidationResult> {
  const result: ValidationResult = { valid: false, data: null, error: null, age: 0 };

  try {
    if (!initData) {
      result.error = 'initData is empty';
      return result;
    }
    if (!botToken) {
      result.error = 'TELEGRAM_BOT_TOKEN secret is not configured';
      return result;
    }

    const params = new URLSearchParams(initData);

    const hash = params.get('hash');
    const authDateStr = params.get('auth_date');
    const userStr = params.get('user');

    if (!hash) {
      result.error = 'Missing hash parameter';
      return result;
    }
    if (!authDateStr) {
      result.error = 'Missing auth_date parameter';
      return result;
    }
    if (!userStr) {
      result.error = 'Missing user parameter';
      return result;
    }

    // 1. auth_date freshness
    const authDate = parseInt(authDateStr, 10);
    const now = Math.floor(Date.now() / 1000);
    result.age = now - authDate;
    if (result.age < 0 || result.age > MAX_AGE_SECONDS) {
      result.error = `Auth date expired: ${result.age}s old (max ${MAX_AGE_SECONDS}s)`;
      return result;
    }

    // 2. Build the data-check-string: all params (except hash) sorted
    //    alphabetically, joined with newline, as key=value pairs.
    const dataCheckArr = Array.from(params.entries())
      .filter(([key]) => key !== 'hash')
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    // 3. Secret key = HMAC_SHA256("WebAppData", botToken)
    const secretKey = await hmacSha256(
      new TextEncoder().encode('WebAppData'),
      botToken,
    );

    // 4. Provided hash = HMAC_SHA256(secretKey, dataCheckString)
    const computedHash = toHex(await hmacSha256(secretKey, dataCheckArr));

    // 5. Timing-safe comparison
    if (computedHash !== hash) {
      result.error = 'Invalid signature: hash mismatch';
      return result;
    }

    // 6. Parse user
    const user = JSON.parse(decodeURIComponent(userStr));

    result.valid = true;
    result.data = {
      userId: user.id,
      firstName: user.first_name || '',
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      isPremium: user.is_premium || false,
      photoUrl: user.photo_url,
      authDate,
      startParam: params.get('start_param') || undefined,
      queryId: params.get('query_id') || undefined,
      chatInstance: params.get('chat_instance') || undefined,
      chatType: params.get('chat_type') || undefined,
      canSendAfter: params.get('can_send_after')
        ? parseInt(params.get('can_send_after')!, 10)
        : undefined,
    };
    return result;
  } catch (error) {
    result.error =
      `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }
}
