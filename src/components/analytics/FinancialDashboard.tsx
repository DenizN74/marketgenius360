import React, { useState, useEffect } from 'react';
import { useFinancialAnalytics } from '../../hooks/useFinancialAnalytics';
import { SalesChart } from './SalesChart';
import { TopProducts } from './TopProducts';
import { Calendar, RefreshCw } from 'lucide-react';

interface FinancialDashboardProps {
  storeId: string;
}

export function FinancialDashboard({ storeId }: FinancialDashboardProps) {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return { start, end };
  });

  const { loading, getMetrics, getTopProducts } = useFinancialAnalytics(storeId);
  const [metrics, setMetrics] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [metricsData, productsData] = await Promise.all([
        getMetrics(dateRange),
        getTopProducts(dateRange),
      ]);

      if (metricsData) setMetrics(metricsData);
      if (productsData) setTopProducts(productsData);
    };

    fetchData();
  }, [dateRange, getMetrics, getTopProducts]);

  if (loading && !metrics) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your store's performance and financial metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
            </span>
          </div>
          
          <button
            onClick={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 30);
              setDateRange({ start, end });
            }}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics && <SalesChart data={metrics.metrics} />}
        <TopProducts products={topProducts} />
      </div>
    </div>
  );
}