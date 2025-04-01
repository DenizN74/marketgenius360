---
sidebar_position: 1
---

# Docker Deployment Guide

This guide explains how to deploy MarketGenius 360 using Docker and Docker Compose.

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher
- 4GB RAM minimum
- 20GB disk space

## Configuration

1. Clone the repository:
```bash
git clone https://github.com/marketgenius360/marketgenius360.git
cd marketgenius360
```

2. Create environment files:
```bash
cp .env.example .env
```

3. Update the environment variables in `.env`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
VITE_SENTRY_DSN=your-sentry-dsn
GRAFANA_ADMIN_PASSWORD=your-grafana-password
```

## Building and Running

1. Build the containers:
```bash
docker-compose build
```

2. Start the services:
```bash
docker-compose up -d
```

3. Monitor the logs:
```bash
docker-compose logs -f
```

## Scaling

To scale the application horizontally:
```bash
docker-compose up -d --scale app=3
```

## Monitoring

Access the monitoring dashboards:
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

## Troubleshooting

Common issues and solutions:

1. **Container fails to start**
   - Check logs: `docker-compose logs app`
   - Verify environment variables
   - Ensure ports are available

2. **Database connection issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure database migrations are applied

3. **Memory issues**
   - Increase Docker memory limit
   - Monitor container metrics
   - Consider scaling horizontally