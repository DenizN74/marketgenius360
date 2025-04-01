import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import Stripe from "npm:stripe@14.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    if (req.method === "POST" && path === "create-payment-intent") {
      const { amount, currency = "USD", storeId, transactionId } = await req.json();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          storeId,
          transactionId,
        },
      });

      // Create payment record in database
      const { error: dbError } = await supabase
        .from("payments")
        .insert({
          store_id: storeId,
          transaction_id: transactionId,
          amount,
          currency,
          status: "pending",
          payment_method: "card",
          payment_intent_id: paymentIntent.id,
        });

      if (dbError) throw dbError;

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (req.method === "POST" && path === "webhook") {
      const signature = req.headers.get("stripe-signature");
      if (!signature) throw new Error("No signature provided");

      const body = await req.text();
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "",
      );

      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          await handlePaymentSuccess(paymentIntent);
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object;
          await handlePaymentFailure(paymentIntent);
          break;
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

async function handlePaymentSuccess(paymentIntent: any) {
  const { error } = await supabase
    .from("payments")
    .update({
      status: "succeeded",
      updated_at: new Date().toISOString(),
    })
    .eq("payment_intent_id", paymentIntent.id);

  if (error) throw error;
}

async function handlePaymentFailure(paymentIntent: any) {
  const { error } = await supabase
    .from("payments")
    .update({
      status: "failed",
      error_message: paymentIntent.last_payment_error?.message,
      updated_at: new Date().toISOString(),
    })
    .eq("payment_intent_id", paymentIntent.id);

  if (error) throw error;
}