import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  errorMessage?: string;
}

export function PaymentStatus({ status, errorMessage }: PaymentStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'succeeded':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case 'failed':
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          title: 'Payment Failed',
          message: errorMessage || 'There was an error processing your payment.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
        };
      case 'refunded':
        return {
          icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
          title: 'Payment Refunded',
          message: 'Your payment has been refunded.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
        };
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
          title: 'Payment Pending',
          message: 'Your payment is being processed.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </h3>
          <div className={`mt-2 text-sm ${config.textColor}`}>
            <p>{config.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}