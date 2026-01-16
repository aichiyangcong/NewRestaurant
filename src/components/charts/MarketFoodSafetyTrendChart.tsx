import ReactECharts from 'echarts-for-react';
import { useState } from 'react';

interface MarketFoodSafetyTrendChartProps {
  dates: string[];
  markets: string[];
  data: Record<string, number[]>;
  granularity: 'day' | 'week';
  onGranularityChange: (granularity: 'day' | 'week') => void;
  height?: number;
  onDataPointClick?: (market: string, date: string) => void;
}

const MARKET_COLORS: Record<string, string> = {
  '东北市场': '#3b82f6',
  '华南市场': '#10b981',
  '华中市场': '#f59e0b',
  '京津市场': '#ef4444',
  '山东市场': '#8b5cf6',
  '上海市场': '#ec4899',
  '苏皖市场': '#06b6d4',
  '西南市场': '#84cc16',
  '浙江市场': '#f97316',
};

export function MarketFoodSafetyTrendChart({
  dates,
  markets,
  data,
  granularity,
  onGranularityChange,
  height = 320,
  onDataPointClick,
}: MarketFoodSafetyTrendChartProps) {
  const [highlightedMarket, setHighlightedMarket] = useState<string | null>(null);

  const title = `各市场食品安全事件趋势-${granularity === 'week' ? '周' : '日'}`;

  const series = markets.map(market => ({
    name: market,
    type: 'line',
    data: data[market]?.map(v => Number(v.toFixed(1))) || [],
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: highlightedMarket === null || highlightedMarket === market ? 2 : 1,
      opacity: highlightedMarket === null || highlightedMarket === market ? 1 : 0.2,
    },
    itemStyle: {
      color: MARKET_COLORS[market] || '#6b7280',
      opacity: highlightedMarket === null || highlightedMarket === market ? 1 : 0.2,
    },
    emphasis: {
      focus: 'series',
      lineStyle: { width: 3 },
    },
  }));

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const date = params[0].axisValue;
        let content = `<div style="font-weight:600;margin-bottom:4px;">${date}</div>`;
        const sorted = [...params].sort((a: any, b: any) => b.value - a.value);
        sorted.slice(0, 5).forEach((item: any) => {
          content += `<div style="display:flex;justify-content:space-between;gap:12px;">
            <span>${item.marker}${item.seriesName}</span>
            <span style="font-weight:600;">${item.value} 件</span>
          </div>`;
        });
        if (sorted.length > 5) {
          content += `<div style="color:#9ca3af;font-size:11px;margin-top:4px;">...及其他 ${sorted.length - 5} 个市场</div>`;
        }
        return content;
      },
    },
    legend: {
      data: markets,
      bottom: 0,
      type: 'scroll',
      textStyle: {
        color: '#6b7280',
        fontSize: 11,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLabel: {
        color: '#6b7280',
        fontSize: 10,
        rotate: dates.length > 10 ? 45 : 0,
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
    series,
  };

  const handleClick = (params: any) => {
    if (params.componentType === 'series' && onDataPointClick) {
      onDataPointClick(params.seriesName, params.name);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
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
              granularity === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => onGranularityChange('week')}
          >
            周
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-2">点击可查看用户原声</p>
      <ReactECharts
        option={option}
        style={{ height }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: handleClick,
          legendselectchanged: (params: any) => {
            const selected = Object.entries(params.selected).filter(([_, v]) => v);
            if (selected.length === 1) {
              setHighlightedMarket(selected[0][0]);
            } else {
              setHighlightedMarket(null);
            }
          },
        }}
      />
    </div>
  );
}
