import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface DateRange {
  start: Date;
  end: Date;
}

interface FinancialMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  metrics: Array<{
    date: string;
    total_sales: number;
    total_orders: number;
    average_order_value: number;
  }>;
}

interface TopProduct {
  id: string;
  name: string;
  total_quantity: number;
  total_revenue: number;
}

export function useFinancialAnalytics(storeId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMetrics = useCallback(async (range: DateRange): Promise<FinancialMetrics | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('financial_metrics')
        .select('*')
        .eq('store_id', storeId)
        .gte('date', range.start.toISOString().split('T')[0])
        .lte('date', range.end.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          totalSales: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          metrics: [],
        };
      }

      const totalSales = data.reduce((sum, metric) => sum + metric.total_sales, 0);
      const totalOrders = data.reduce((sum, metric) => sum + metric.total_orders, 0);
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      return {
        totalSales,
        totalOrders,
        averageOrderValue,
        metrics: data,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const getTopProducts = useCallback(async (range: DateRange): Promise<TopProduct[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('get_top_products', {
          p_store_id: storeId,
          p_start_date: range.start.toISOString(),
          p_end_date: range.end.toISOString(),
        });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch top products';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return {
    loading,
    error,
    getMetrics,
    getTopProducts,
  };
}