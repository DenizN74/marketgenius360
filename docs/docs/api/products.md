---
sidebar_position: 2
---

# Products API

The Products API allows you to manage your product catalog, including creating, updating, and deleting products.

## List Products

```http
GET /api/products
```

Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search products by name or SKU

Response:
```json
{
  "data": [
    {
      "id": "product-id",
      "name": "Product Name",
      "sku": "SKU123",
      "price": 99.99,
      "stock": 100,
      "category": "Electronics",
      "description": "Product description",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## Create Product

```http
POST /api/products
```

Request Body:
```json
{
  "name": "New Product",
  "sku": "SKU123",
  "price": 99.99,
  "stock": 100,
  "category": "Electronics",
  "description": "Product description"
}
```

## Update Product

```http
PUT /api/products/:id
```

Request Body:
```json
{
  "price": 149.99,
  "stock": 50
}
```

## Delete Product

```http
DELETE /api/products/:id
```

## Get Price Recommendation

```http
GET /api/products/:id/price-recommendation
```

Response:
```json
{
  "current_price": 99.99,
  "recommended_price": 129.99,
  "confidence": 0.85,
  "factors": {
    "demand": 0.8,
    "competition": 0.7,
    "inventory": 0.9
  }
}
```