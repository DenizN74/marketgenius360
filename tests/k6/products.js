import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, STAGES, THRESHOLDS } from './config.js';

export const options = {
  stages: STAGES.load,
  thresholds: THRESHOLDS,
};

export function setup() {
  // Login and get token
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

  // List products
  const listRes = http.get(`${BASE_URL}/api/products`, params);
  check(listRes, {
    'list products successful': (r) => r.status === 200,
  });

  sleep(1);

  // Create product
  const createRes = http.post(`${BASE_URL}/api/products`, JSON.stringify({
    name: `Test Product ${Date.now()}`,
    sku: `SKU-${Date.now()}`,
    price: 99.99,
    stock: 100,
  }), params);

  check(createRes, {
    'create product successful': (r) => r.status === 201,
  });

  const productId = createRes.json('id');
  sleep(1);

  // Get product details
  const getRes = http.get(`${BASE_URL}/api/products/${productId}`, params);
  check(getRes, {
    'get product successful': (r) => r.status === 200,
  });

  sleep(1);

  // Update product
  const updateRes = http.put(`${BASE_URL}/api/products/${productId}`, JSON.stringify({
    price: 149.99,
  }), params);

  check(updateRes, {
    'update product successful': (r) => r.status === 200,
  });

  sleep(1);

  // Delete product
  const deleteRes = http.del(`${BASE_URL}/api/products/${productId}`, null, params);
  check(deleteRes, {
    'delete product successful': (r) => r.status === 204,
  });

  sleep(1);
}