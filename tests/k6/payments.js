import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, STAGES, THRESHOLDS } from './config.js';

export const options = {
  stages: STAGES.load,
  thresholds: THRESHOLDS,
};

export function setup() {
  // Login and create a test transaction
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'test-password-123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  return { token: loginRes.json('token') };
}

export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  };

  // Create payment intent
  const createRes = http.post(`${BASE_URL}/api/payments/charge`, JSON.stringify({
    amount: 99.99,
    currency: 'USD',
  }), params);

  check(createRes, {
    'create payment intent successful': (r) => r.status === 200,
    'received client secret': (r) => r.json('clientSecret') !== undefined,
  });

  const paymentId = createRes.json('id');
  sleep(1);

  // Get payment status
  const statusRes = http.get(`${BASE_URL}/api/payments/transaction/${paymentId}`, params);
  check(statusRes, {
    'get payment status successful': (r) => r.status === 200,
  });

  sleep(1);

  // Process refund
  const refundRes = http.post(`${BASE_URL}/api/payments/refund`, JSON.stringify({
    paymentId,
    amount: 99.99,
  }), params);

  check(refundRes, {
    'process refund successful': (r) => r.status === 200,
  });

  sleep(1);
}