import { useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface MarketNegativeTrendChart2Props {
  height?: number;
}

const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6'];

export function MarketNegativeTrendChart2({ height = 280 }: MarketNegativeTrendChart2Props) {
  const [granularity, setGranularity] = useState<'day' | 'week'>('week');

  const markets = ['东北市场', '华南市场', '华中市场', '京津市场', '山东市场', '上海市场'];
  
  const weeklyDates = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
  const dailyDates = ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'];

  const dates = granularity === 'week' ? weeklyDates : dailyDates;

  const weeklyData: Record<string, number[]> = {
    '东北市场': [8, 12, 7, 10, 9, 11],
    '华南市场': [5, 8, 6, 7, 5, 6],
    '华中市场': [4, 5, 4, 6, 5, 4],
    '京津市场': [15, 18, 14, 16, 17, 15],
    '山东市场': [3, 4, 3, 5, 4, 3],
    '上海市场': [22, 25, 20, 23, 24, 21],
  };

  const dailyData: Record<string, number[]> = {
    '东北市场': [1, 2, 1, 2, 1, 2, 1],
    '华南市场': [1, 1, 1, 1, 0, 1, 1],
    '华中市场': [1, 0, 1, 1, 1, 0, 1],
    '京津市场': [2, 3, 2, 3, 2, 3, 2],
    '山东市场': [0, 1, 0, 1, 1, 0, 1],
    '上海市场': [3, 4, 3, 4, 3, 4, 3],
  };

  const data = granularity === 'week' ? weeklyData : dailyData;

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let content = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`;
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
      data: markets,
      bottom: 0,
      textStyle: {
        color: '#6b7280',
        fontSize: 10,
      },
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
    },
    yAxis: {
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
    series: markets.map((market, idx) => ({
      name: market,
      type: 'line',
      data: data[market],
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: colors[idx % colors.length],
      },
      itemStyle: {
        color: colors[idx % colors.length],
      },
    })),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">各市场差评趋势分析</h3>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setGranularity('day')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              granularity === 'day'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            日
          </button>
          <button
            onClick={() => setGranularity('week')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              granularity === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            周
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
