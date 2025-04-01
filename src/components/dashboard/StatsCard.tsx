import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, trend }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex items-baseline mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="ml-1">{change}%</span>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;