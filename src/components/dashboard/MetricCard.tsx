import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'yellow' | 'orange' | 'green' | 'default';
  isActive?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
  showInfo?: boolean;
  toggleOptions?: { labels: [string, string]; activeIndex: number; onToggle: (index: number) => void };
}

export function MetricCard({
  title,
  subtitle,
  value,
  subValue,
  trend,
  trendLabel,
  color = 'default',
  isActive = false,
  isDimmed = false,
  onClick,
  showInfo = false,
  toggleOptions,
}: MetricCardProps) {
  const borderColors = {
    blue: 'border-l-blue-500',
    yellow: 'border-l-yellow-500',
    orange: 'border-l-orange-500',
    green: 'border-l-green-500',
    default: 'border-l-gray-300',
  };

  const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-500';
  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <div
      className={clsx(
        'rounded-xl p-5 transition-all cursor-pointer border-l-4 bg-white',
        'border-t border-r border-b border-gray-100',
        borderColors[color],
        isActive && 'bg-blue-50 !border-t-blue-200 !border-r-blue-200 !border-b-blue-200 shadow-md',
        isDimmed && 'opacity-50',
        !isActive && !isDimmed && 'hover:shadow-md hover:border-gray-200',
        onClick && !isDimmed && 'hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={clsx(
              'text-sm font-medium',
              isActive ? 'text-blue-700' : 'text-gray-700'
            )}>{title}</h3>
            {subtitle && <span className="text-gray-400 text-xs">（{subtitle}）</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {toggleOptions && (
            <div 
              className="flex bg-gray-100 rounded-md p-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {toggleOptions.labels.map((label, idx) => (
                <button
                  key={label}
                  className={clsx(
                    'px-2 py-1 text-xs rounded transition-colors',
                    toggleOptions.activeIndex === idx
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  )}
                  onClick={() => toggleOptions.onToggle(idx)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {showInfo && (
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          )}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className={clsx(
            'text-3xl font-bold',
            isActive ? 'text-blue-700' : 'text-gray-900'
          )}>{value}</div>
          {subValue && <p className="text-gray-500 text-xs mt-1">{subValue}</p>}
        </div>
        
        {trend !== undefined && (
          <div className={clsx('flex items-center gap-1 text-sm', trendColor)}>
            <TrendIcon className="w-4 h-4" />
            <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}{trendLabel || ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
