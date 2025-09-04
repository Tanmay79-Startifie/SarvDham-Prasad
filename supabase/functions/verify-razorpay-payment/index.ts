import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = await req.json();

    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET_KEY");
    if (!razorpaySecret) {
      throw new Error("Razorpay secret key not configured");
    }

    // Verify signature using built-in crypto
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(razorpaySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Convert received signature to hex format for comparison
    const receivedSignature = razorpaySignature;

    const isValidSignature = expectedSignature === receivedSignature;

    // Create Supabase client
    const supabaseUrl = "https://ehzojezyyynobqiksiql.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey!, {
      auth: { persistSession: false }
    });

    if (isValidSignature) {
      // Update order status to paid
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          payment_id: razorpayPaymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
        throw new Error("Failed to update order status");
      }

      console.log("Payment verified and order updated successfully:", orderId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      // Update order status to failed
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Payment verification failed",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error in verify-razorpay-payment function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});