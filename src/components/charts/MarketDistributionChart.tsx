import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { MarketDistributionItem } from '../../data/negativeRateData';

interface MarketDistributionChartProps {
  data: MarketDistributionItem[];
  height?: number;
  onMarketClick?: (market: string) => void;
}

type SortMode = 'positive' | 'negative';

export function MarketDistributionChart({ data, height = 280, onMarketClick }: MarketDistributionChartProps) {
  const [sortMode, setSortMode] = useState<SortMode>('negative');

  const sortedData = [...data].sort((a, b) => 
    sortMode === 'negative' ? b.negativeCount - a.negativeCount : b.positiveCount - a.positiveCount
  );

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const market = params[0].axisValue;
        let content = `<div style="font-weight:600;margin-bottom:4px;">${market}</div>`;
        params.forEach((item: any) => {
          content += `<div style="display:flex;justify-content:space-between;gap:12px;">
            <span>${item.marker}${item.seriesName}</span>
            <span style="font-weight:600;">${item.value}</span>
          </div>`;
        });
        return content;
      },
    },
    legend: {
      data: ['好评数', '差评数'],
      right: 0,
      bottom: 0,
      textStyle: {
        color: '#6b7280',
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '12%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#6b7280',
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(d => d.market),
      inverse: true,
      axisLabel: {
        color: '#374151',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
    },
    series: [
      {
        name: '好评数',
        type: 'bar',
        stack: 'total',
        data: sortedData.map(d => d.positiveCount),
        itemStyle: {
          color: '#3b82f6',
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 10,
          formatter: (params: any) => params.value > 20 ? params.value : '',
        },
      },
      {
        name: '差评数',
        type: 'bar',
        stack: 'total',
        data: sortedData.map(d => d.negativeCount),
        itemStyle: {
          color: '#f97316',
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          color: '#6b7280',
          fontSize: 10,
        },
      },
    ],
  };

  const handleClick = (params: any) => {
    if (params.componentType === 'series' && onMarketClick) {
      onMarketClick(params.name);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">各市场好差评分布</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">排序:</span>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setSortMode('negative')}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                sortMode === 'negative'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              差评
            </button>
            <button
              onClick={() => setSortMode('positive')}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                sortMode === 'positive'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              好评
            </button>
          </div>
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height }}
        opts={{ renderer: 'canvas' }}
        onEvents={{ click: handleClick }}
      />
    </div>
  );
}
