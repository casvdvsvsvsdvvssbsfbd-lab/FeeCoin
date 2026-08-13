import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id") || url.searchParams.get("subid");
    const rewardStr = url.searchParams.get("reward") || "100";
    const blockId = url.searchParams.get("block_id"); // AdsGram Block ID
    const platformId = url.searchParams.get("platform_id"); // AdsGram Platform ID
    const transactionId = url.searchParams.get("tx_id") || url.searchParams.get("transaction_id"); // AdsGram Transaction ID

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing user identification parameter (user_id)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!blockId || blockId !== "42176") {
        return new Response(JSON.stringify({ error: "Invalid or missing AdsGram Block ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!platformId || platformId !== "39484") {
        return new Response(JSON.stringify({ error: "Invalid or missing AdsGram Platform ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const rewardAmount = parseFloat(rewardStr) || 100;

    // 1. Fetch user wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ error: "Wallet or user not found", details: walletError }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Check for duplicate transaction (using transactionId)
    if (transactionId) {
      const { data: existingTx, error: existingTxError } = await supabase
        .from("transactions")
        .select("id")
        .eq("provider", "adsgram")
        .eq("provider_transaction_id", transactionId) // Assuming `provider_transaction_id` field for external IDs
        .single();

      if (!existingTxError && existingTx) {
        return new Response(JSON.stringify({ success: true, message: "Duplicate transaction, already processed." }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 3. Add transaction record
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      amount: rewardAmount,
      type: "reward",
      status: "completed",
      description: "AdsGram ad reward",
      provider: "adsgram",
      provider_transaction_id: transactionId, // Store AdsGram's transaction ID
    });

    if (txError) {
      return new Response(JSON.stringify({ error: "Failed to create transaction", details: txError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Update wallet balance
    const updatedBalance = (wallet.available_fc || wallet.balance || 0) + rewardAmount;
    const { error: updateError } = await supabase
      .from("wallets")
      .update({
        available_fc: updatedBalance,
        total_earned: (wallet.total_earned || 0) + rewardAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Failed to update wallet balance", details: updateError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, reward: rewardAmount, new_balance: updatedBalance }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
