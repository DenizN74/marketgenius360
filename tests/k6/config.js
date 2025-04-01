// Common configuration for k6 tests
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';
export const STAGES = {
  smoke: [
    { duration: '1m', target: 1 }, // 1 user for 1 minute
  ],
  load: [
    { duration: '2m', target: 50 }, // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 }, // Stay at 50 users for 5 minutes
    { duration: '2m', target: 0 },  // Ramp down to 0 users
  ],
  stress: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  spike: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 300 },  // Spike to 300 users
    { duration: '2m', target: 300 },  // Stay at 300 users
    { duration: '1m', target: 50 },   // Scale down to 50 users
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
};

export const THRESHOLDS = {
  http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
};