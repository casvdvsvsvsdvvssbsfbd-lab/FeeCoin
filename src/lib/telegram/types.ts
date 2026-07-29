// ============================================
// Telegram WebApp Types
// Based on Telegram Mini Apps SDK
// ============================================

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

export interface TelegramChat {
  id: number;
  type: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showPopup: (params: PopupParams, callback?: (button_id: string) => void) => void;
  showMainButton: (params?: MainButtonParams) => void;
  hideMainButton: () => void;
  showSecondaryButton: (params?: SecondaryButtonParams) => void;
  hideSecondaryButton: () => void;
  showBackButton: (callback?: () => void) => void;
  hideBackButton: () => void;
  showSettingsButton: (callback?: () => void) => void;
  hideSettingsButton: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderParams: (params: HeaderParams) => void;
  onEvent: (event: string, callback: (...args: any[]) => void) => void;
  offEvent: (event: string, callback: (...args: any[]) => void) => void;
  HapticFeedback: HapticFeedback;
  CloudStorage: CloudStorage;
  themeParams: TelegramThemeParams;
  initData: string;
  initDataUnsafe: TelegramInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  MainButton: MainButton;
  SecondaryButton: SecondaryButton;
  BackButton: BackButton;
  SettingsButton: SettingsButton;
  safeAreaInsets: SafeAreaInsets;
}

export interface PopupParams {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}

export interface PopupButton {
  id?: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text?: string;
}

export interface MainButtonParams {
  text?: string;
  color?: string;
  text_color?: string;
  is_active?: boolean;
  is_visible?: boolean;
}

export interface MainButton {
  setText: (text: string) => void;
  setParams: (params: MainButtonParams) => void;
  show: () => void;
  hide: () => void;
  setTextColor: (color: string) => void;
  setColor: (color: string) => void;
  isActive: boolean;
  isVisible: boolean;
  text: string;
  color: string;
  textColor: string;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface SecondaryButtonParams {
  text?: string;
  color?: string;
  text_color?: string;
  is_active?: boolean;
  is_visible?: boolean;
}

export interface SecondaryButton {
  setText: (text: string) => void;
  setParams: (params: SecondaryButtonParams) => void;
  show: () => void;
  hide: () => void;
  setTextColor: (color: string) => void;
  setColor: (color: string) => void;
  isActive: boolean;
  isVisible: boolean;
  text: string;
  color: string;
  textColor: string;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface BackButton {
  show: (callback?: () => void) => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  isVisible: boolean;
}

export interface SettingsButton {
  show: (callback?: () => void) => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  isVisible: boolean;
}

export interface HeaderParams {
  color?: string;
  bg_color?: string;
}

export interface HapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

export interface CloudStorage {
  getItem: (key: string, callback: (error: string | null, value: string | null) => void) => void;
  setItem: (key: string, value: string, callback: (error: string | null) => void) => void;
  removeItem: (key: string, callback: (error: string | null) => void) => void;
  getItems: (keys: string[], callback: (error: string | null, values: Record<string, string>) => void) => void;
  setItems: (items: Record<string, string>, callback: (error: string | null) => void) => void;
  removeItems: (keys: string[], callback: (error: string | null) => void) => void;
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ViewportInfo {
  height: number;
  stableHeight: number;
  width: number;
  isExpanded: boolean;
}

export interface DeviceInfo {
  platform: string;
  version: string;
  colorScheme: 'light' | 'dark';
  isPremium: boolean;
  languageCode: string;
  viewport: ViewportInfo;
  safeArea: SafeAreaInsets;
}

export interface LaunchParams {
  userId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  startParam?: string;
  queryId?: string;
  chatInstance?: string;
  chatType?: string;
  canSendAfter?: number;
  authDate: number;
  hash: string;
}

export interface AppConfig {
  appName: string;
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  sentryDsn?: string;
  amplitudeApiKey?: string;
  mixpanelToken?: string;
}

export interface FeatureFlags {
  [key: string]: boolean | number | string | object;
}

export interface RemoteConfig {
  [key: string]: any;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  deviceName?: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  status: 'active' | 'expired' | 'revoked';
  lastActiveAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  isOnline: boolean;
  isAuthenticated: boolean;
  user: TelegramUser | null;
  device: DeviceInfo | null;
  launchParams: LaunchParams | null;
  config: AppConfig | null;
  featureFlags: FeatureFlags;
  remoteConfig: RemoteConfig;
  session: UserSession | null;
  error: Error | null;
  lastError?: {
    error: Error;
    timestamp: number;
  };
}

export interface BootstrapOptions {
  skipOnboarding?: boolean;
  skipAuth?: boolean;
  enableAnalytics?: boolean;
  enableCrashReporting?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableTelemetry?: boolean;
}