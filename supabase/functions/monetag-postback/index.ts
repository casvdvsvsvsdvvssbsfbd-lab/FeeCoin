import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("subid") || url.searchParams.get("user_id") || url.searchParams.get("extra");
    const payoutStr = url.searchParams.get("payout") || url.searchParams.get("reward") || "100";
    
    // Monetag custom parameters usually pass subid / extra values.
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing user identification parameter (subid)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rewardAmount = parseFloat(payoutStr) || 100;

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

    // 2. Add transaction record
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      amount: rewardAmount,
      type: "reward",
      status: "completed",
      description: "Monetag ad reward",
      provider: "monetag",
    });

    if (txError) {
      return new Response(JSON.stringify({ error: "Failed to create transaction", details: txError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Update wallet balance
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
