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

  // Get sales report
  const salesRes = http.get(`${BASE_URL}/api/reports/sales?period=monthly`, params);
  check(salesRes, {
    'get sales report successful': (r) => r.status === 200,
  });

  sleep(1);

  // Get profit/loss report
  const plRes = http.get(`${BASE_URL}/api/reports/profit-loss?period=monthly`, params);
  check(plRes, {
    'get profit/loss report successful': (r) => r.status === 200,
  });

  sleep(1);

  // Get dashboard metrics
  const dashboardRes = http.get(`${BASE_URL}/api/reports/dashboard`, params);
  check(dashboardRes, {
    'get dashboard metrics successful': (r) => r.status === 200,
  });

  sleep(1);
}