import React from 'react';
import { useDynamicPricing } from '../../hooks/useDynamicPricing';
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, Package, DollarSign } from 'lucide-react';

interface PriceRecommendationProps {
  productId: string;
  currentPrice: number;
}

export function PriceRecommendation({ productId, currentPrice }: PriceRecommendationProps) {
  const { loading, getPriceRecommendation } = useDynamicPricing();
  const [recommendation, setRecommendation] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchRecommendation = async () => {
      const data = await getPriceRecommendation(productId);
      if (data) {
        setRecommendation(data);
      }
    };

    fetchRecommendation();
  }, [productId, getPriceRecommendation]);

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const priceDifference = recommendation.recommendedPrice - currentPrice;
  const percentChange = ((priceDifference / currentPrice) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Price Recommendation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Current Price</span>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            ${currentPrice.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Recommended Price</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              ${recommendation.recommendedPrice.toFixed(2)}
            </p>
            <span className={`ml-2 flex items-baseline text-sm font-semibold ${
              priceDifference >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceDifference >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {Math.abs(percentChange)}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Contributing Factors</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Demand</p>
              <div className="mt-1 h-2 w-24 bg-gray-200 rounded">
                <div 
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${recommendation.factors.demand * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Competition</p>
              <div className="mt-1 h-2 w-24 bg-gray-200 rounded">
                <div 
                  className="h-2 bg-purple-500 rounded"
                  style={{ width: `${recommendation.factors.competition * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Inventory</p>
              <div className="mt-1 h-2 w-24 bg-gray-200 rounded">
                <div 
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${recommendation.factors.inventory * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Confidence Score</span>
          <span className="text-sm font-medium text-gray-900">
            {(recommendation.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded">
          <div 
            className="h-2 bg-indigo-500 rounded"
            style={{ width: `${recommendation.confidence * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}