---
sidebar_position: 1
---

# API Reference

MarketGenius 360 provides a comprehensive RESTful API that allows you to integrate our platform with your existing systems.

## Authentication

All API endpoints require authentication using JWT tokens. To obtain a token, you need to authenticate using your API credentials.

```bash
curl -X POST https://api.marketgenius360.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "password": "your-password"}'
```

The response will include your access token:

```json
{
  "token": "your.jwt.token",
  "user": {
    "id": "user-id",
    "email": "your-email@example.com"
  }
}
```

Use this token in the Authorization header for all subsequent requests:

```bash
curl -X GET https://api.marketgenius360.com/api/products \
  -H "Authorization: Bearer your.jwt.token"
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for free tier
- 1000 requests per minute for premium tier

## Error Handling

The API uses conventional HTTP response codes:
- 2xx for successful requests
- 4xx for client errors
- 5xx for server errors

Error responses include a message explaining what went wrong:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": {
      "field": "email",
      "issue": "must be a valid email address"
    }
  }
}
```