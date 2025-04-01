import React from 'react';
import { useDynamicPricing } from '../../hooks/useDynamicPricing';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TrendReportProps {
  productId: string;
}

export function TrendReport({ productId }: TrendReportProps) {
  const { loading, getTrendReport } = useDynamicPricing();
  const [report, setReport] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchReport = async () => {
      const data = await getTrendReport(productId);
      if (data) {
        setReport(data);
      }
    };

    fetchReport();
  }, [productId, getTrendReport]);

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

  if (!report) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Price Trend Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Price Elasticity</span>
            {report.priceElasticity >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {Math.abs(report.priceElasticity).toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Seasonality Factor</span>
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {report.seasonalityFactor.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Recommended Range</span>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            ${report.recommendedPriceRange.min.toFixed(2)} - ${report.recommendedPriceRange.max.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Historical Price & Sales Trend</h4>
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            {report.historicalPrices.map((point: any, index: number) => {
              const x = (index / (report.historicalPrices.length - 1)) * 100;
              const y = ((point.price - report.recommendedPriceRange.min) / 
                (report.recommendedPriceRange.max - report.recommendedPriceRange.min)) * 100;
              
              return (
                <div
                  key={point.date}
                  className="absolute h-2 w-2 bg-indigo-500 rounded-full"
                  style={{
                    left: `${x}%`,
                    bottom: `${y}%`,
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2">
                      ${point.price.toFixed(2)}
                      <br />
                      {point.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Price elasticity indicates {Math.abs(report.priceElasticity)} units change in demand for every 1% price change</span>
          </li>
          <li className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-indigo-500" />
            <span>Seasonal factor of {report.seasonalityFactor.toFixed(2)} suggests {
              report.seasonalityFactor > 1 ? 'increased' : 'decreased'
            } demand in current period</span>
          </li>
        </ul>
      </div>
    </div>
  );
}