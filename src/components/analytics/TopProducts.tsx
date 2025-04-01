import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

interface TopProduct {
  id: string;
  name: string;
  total_quantity: number;
  total_revenue: number;
}

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Top Performing Products</h3>
        <Package className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.total_quantity} units sold
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                ${product.total_revenue.toFixed(2)}
              </p>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs ml-1">
                  {((product.total_revenue / products[0].total_revenue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}