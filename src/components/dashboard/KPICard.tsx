import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPISkeleton } from '../common/LoadingSkeleton';
import clsx from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  loading?: boolean;
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function KPICard({ title, value, trend, icon, loading, color = 'blue', isActive, onClick }: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <KPISkeleton />
      </div>
    );
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const trendColor = trend && trend > 0 ? 'text-red-600' : 'text-green-600';
  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg shadow-sm border p-6 transition-all',
        onClick && 'cursor-pointer hover:shadow-md',
        isActive && 'ring-2 ring-blue-500 shadow-md'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
