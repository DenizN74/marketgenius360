import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, STAGES, THRESHOLDS } from './config.js';

export const options = {
  stages: STAGES.load,
  thresholds: {
    ...THRESHOLDS,
    http_req_duration: ['p(95)<1000'], // Allow more time for AI processing
  },
};

export function setup() {
  // Login and create a test product
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'test-password-123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('token');
  const createRes = http.post(`${BASE_URL}/api/products`, JSON.stringify({
    name: `Test Product ${Date.now()}`,
    sku: `SKU-${Date.now()}`,
    price: 99.99,
    stock: 100,
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return {
    token,
    productId: createRes.json('id'),
  };
}

export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`,
    },
  };

  // Get price recommendation
  const recommendationRes = http.post(`${BASE_URL}/api/ai/predict`, JSON.stringify({
    productId: data.productId,
  }), params);

  check(recommendationRes, {
    'get price recommendation successful': (r) => r.status === 200,
    'received recommendation': (r) => r.json('recommendedPrice') !== undefined,
  });

  sleep(2);

  // Get trend report
  const trendRes = http.get(`${BASE_URL}/api/ai/trend-report?productId=${data.productId}`, params);

  check(trendRes, {
    'get trend report successful': (r) => r.status === 200,
    'received trend data': (r) => r.json('historicalPrices') !== undefined,
  });

  sleep(2);
}