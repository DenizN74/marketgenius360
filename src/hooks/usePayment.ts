import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentOptions {
  amount: number;
  currency?: string;
  storeId: string;
  transactionId: string;
}

export function usePayment() {
  const [loading, setLoading] = useState(false);

  const processPayment = async ({ amount, currency = 'USD', storeId, transactionId }: PaymentOptions) => {
    try {
      setLoading(true);

      // Create payment intent
      const { data: { clientSecret }, error: intentError } = await supabase.functions.invoke(
        'payment/create-payment-intent',
        {
          body: { amount, currency, storeId, transactionId },
        }
      );

      if (intentError) throw intentError;

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe');

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements: await stripe.elements({
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        }),
        confirmParams: {
          return_url: `${window.location.origin}/payment-complete`,
        },
      });

      if (stripeError) throw stripeError;

      toast.success('Payment processed successfully');
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    processPayment,
  };
}