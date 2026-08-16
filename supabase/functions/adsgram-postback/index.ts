import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("uid");
    const amount = parseInt(url.searchParams.get("amount") || "0");
    const signature = url.searchParams.get("sign");
    
    // Xavfsizlik tekshiruvi (signature)
    const SECRET_KEY = Deno.env.get("ADSGRAM_SECRET") || "your-secret-key";
    const expectedSignBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${userId}:${amount}:${SECRET_KEY}`)
    );
    const expectedSign = Array.from(new Uint8Array(expectedSignBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    if (signature !== expectedSign) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Foydalanuvchi balansini yangilash
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const { data, error } = await supabase.rpc("add_coins", {
      p_user_id: userId,
      p_amount: amount,
      p_source: "adsgram_reward"
    });
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, new_balance: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
});
