import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

const register = new Registry();

// Add default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

export const errorCounter = new Counter({
  name: 'error_count_total',
  help: 'Count of errors by type',
  labelNames: ['type'],
  registers: [register],
});

export const activeUsers = new Counter({
  name: 'active_users_total',
  help: 'Count of active users',
  registers: [register],
});

export const getMetrics = async () => {
  return await register.metrics();
};