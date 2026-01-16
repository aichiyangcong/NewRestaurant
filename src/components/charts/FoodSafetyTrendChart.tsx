import ReactECharts from 'echarts-for-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendPoint {
  date: string;
  count: number;
}

interface FoodSafetyTrendChartProps {
  data: TrendPoint[];
  currentCount: number;
  changeRate: number;
  granularity: 'day' | 'month';
  onGranularityChange: (granularity: 'day' | 'month') => void;
  height?: number;
}

export function FoodSafetyTrendChart({
  data,
  currentCount,
  changeRate,
  granularity,
  onGranularityChange,
  height = 280,
}: FoodSafetyTrendChartProps) {
  const isUp = changeRate > 0;
  const periodLabel = granularity === 'day' ? '本周' : '本月';

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        return `<div style="font-weight:600;">${point.axisValue}</div>
                <div>事件数: <strong>${point.value}</strong> 件</div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      boundaryGap: false,
      axisLabel: {
        color: '#6b7280',
        fontSize: 10,
        rotate: data.length > 15 ? 45 : 0,
      },
      axisLine: {
        lineStyle: { color: '#e5e7eb' },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#6b7280',
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: { color: '#f3f4f6' },
      },
    },
    series: [
      {
        type: 'line',
        data: data.map(d => d.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#f97316',
        },
        itemStyle: {
          color: '#f97316',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(249, 115, 22, 0.3)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0.05)' },
            ],
          },
        },
      },
    ],
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">食品安全事件趋势</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-sm text-gray-600">{periodLabel}</span>
            <span className="text-lg font-bold text-orange-600">{currentCount}</span>
            <span className="text-sm text-gray-600">件</span>
            <div className={`flex items-center gap-0.5 ${isUp ? 'text-red-500' : 'text-green-500'}`}>
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="text-sm font-medium">
                {isUp ? '+' : ''}{changeRate}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex bg-gray-100 rounded-md p-0.5">
          <button
            className={`px-3 py-1 text-xs rounded transition-colors ${
              granularity === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => onGranularityChange('day')}
          >
            日
          </button>
          <button
            className={`px-3 py-1 text-xs rounded transition-colors ${
              granularity === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => onGranularityChange('month')}
          >
            月
          </button>
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
