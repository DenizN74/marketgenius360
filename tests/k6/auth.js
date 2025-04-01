import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, STAGES, THRESHOLDS } from './config.js';

export const options = {
  stages: STAGES.load,
  thresholds: THRESHOLDS,
};

export function setup() {
  // Generate test data
  return {
    email: `test-${Date.now()}@example.com`,
    password: 'test-password-123',
  };
}

export default function (data) {
  // Test registration
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    email: data.email,
    password: data.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'registration successful': (r) => r.status === 200,
  });

  sleep(1);

  // Test login
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: data.email,
    password: data.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'received token': (r) => r.json('token') !== undefined,
  });

  sleep(1);
}