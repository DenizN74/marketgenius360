import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface PriceRecommendation {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  confidence: number;
  factors: {
    demand: number;
    competition: number;
    inventory: number;
  };
}

interface TrendReport {
  productId: string;
  historicalPrices: {
    date: string;
    price: number;
    sales: number;
  }[];
  priceElasticity: number;
  seasonalityFactor: number;
  recommendedPriceRange: {
    min: number;
    max: number;
  };
}

export function useDynamicPricing() {
  const [loading, setLoading] = useState(false);

  const getPriceRecommendation = async (productId: string): Promise<PriceRecommendation | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('dynamic-pricing/predict', {
        body: { productId },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting price recommendation:', error);
      toast.error('Failed to get price recommendation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTrendReport = async (productId: string): Promise<TrendReport | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('dynamic-pricing/trend-report', {
        body: { productId },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting trend report:', error);
      toast.error('Failed to get trend report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPriceRecommendation,
    getTrendReport,
  };
}