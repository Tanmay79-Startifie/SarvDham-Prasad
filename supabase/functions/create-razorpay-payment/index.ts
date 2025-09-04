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
    const { orderData, amount } = await req.json();

    // Initialize Razorpay
    const razorpayKeyId = "rzp_test_RDTPgPXe0b7xzA"; // This should be your publishable key
    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET_KEY");

    if (!razorpaySecret) {
      throw new Error("Razorpay secret key not configured");
    }

    // Create Supabase client
    const supabaseUrl = "https://ehzojezyyynobqiksiql.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey!, {
      auth: { persistSession: false }
    });

    // Create Razorpay order
    const razorpayOrder = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpaySecret}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // Amount already in paise from frontend
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          product_name: orderData.productName,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
        },
      }),
    });

    const razorpayOrderData = await razorpayOrder.json();

    if (!razorpayOrder.ok) {
      console.error("Razorpay order creation failed:", razorpayOrderData);
      throw new Error(razorpayOrderData.error?.description || "Failed to create Razorpay order");
    }

    // Insert order into Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        delivery_address: orderData.deliveryAddress,
        city: orderData.city,
        pincode: orderData.pincode,
        product_id: orderData.productId,
        quantity: orderData.quantity,
        weight: orderData.weight,
        total_amount: amount,
        currency: "INR",
        payment_id: razorpayOrderData.id,
        payment_status: "pending",
        order_status: "received",
        notes: orderData.notes || "",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Database insert error:", orderError);
      throw new Error("Failed to create order in database");
    }

    console.log("Order created successfully:", order.id);
    console.log("Razorpay order created:", razorpayOrderData.id);

    return new Response(
      JSON.stringify({
        success: true,
        razorpayOrderId: razorpayOrderData.id,
        orderId: order.id,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        keyId: razorpayKeyId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-razorpay-payment function:", error);
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