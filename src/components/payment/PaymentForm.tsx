import React from 'react';
import { usePayment } from '../../hooks/usePayment';
import { CreditCard, DollarSign } from 'lucide-react';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
});

interface PaymentFormProps {
  storeId: string;
  transactionId: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({
  storeId,
  transactionId,
  amount,
  currency = 'USD',
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const { loading, processPayment } = usePayment();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedData = paymentSchema.parse({ amount, currency });
      const success = await processPayment({
        ...validatedData,
        storeId,
        transactionId,
      });

      if (success && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <CreditCard className="h-12 w-12 text-indigo-600" />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Complete Your Payment
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Pay
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={amount.toFixed(2)}
              disabled
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{currency}</span>
            </div>
          </div>
        </div>

        <div id="payment-element" className="min-h-[100px] bg-gray-50 rounded-md p-4">
          {/* Stripe Elements will be mounted here */}
        </div>

        <div className="flex space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
}