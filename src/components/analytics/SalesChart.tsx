import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface SalesChartProps {
  data: Array<{
    date: string;
    total_sales: number;
    total_orders: number;
    average_order_value: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const maxSales = Math.max(...data.map(d => d.total_sales));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Sales Trend</h3>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between">
          {data.map((point, index) => {
            const height = (point.total_sales / maxSales) * 100;
            const prevSales = index > 0 ? data[index - 1].total_sales : point.total_sales;
            const trend = point.total_sales >= prevSales;

            return (
              <div
                key={point.date}
                className="group relative flex flex-col items-center"
                style={{ height: '100%', width: `${100 / data.length}%` }}
              >
                <div
                  className={`w-full mx-1 rounded-t ${
                    trend ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2">
                      ${point.total_sales.toFixed(2)}
                      <br />
                      {new Date(point.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {trend ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mt-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            ${data.reduce((sum, d) => sum + d.total_sales, 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {data.reduce((sum, d) => sum + d.total_orders, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg. Order Value</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            ${(data.reduce((sum, d) => sum + d.average_order_value, 0) / data.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}