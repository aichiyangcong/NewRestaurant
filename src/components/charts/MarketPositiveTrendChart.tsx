import { useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface MarketPositiveTrendChartProps {
  height?: number;
}

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

export function MarketPositiveTrendChart({ height = 280 }: MarketPositiveTrendChartProps) {
  const [granularity, setGranularity] = useState<'day' | 'week'>('week');

  const markets = ['东北市场', '华南市场', '华中市场', '京津市场', '山东市场', '上海市场'];
  
  const weeklyDates = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
  const dailyDates = ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'];

  const dates = granularity === 'week' ? weeklyDates : dailyDates;

  const weeklyData: Record<string, number[]> = {
    '东北市场': [85, 92, 78, 88, 95, 82],
    '华南市场': [65, 72, 68, 75, 70, 68],
    '华中市场': [58, 62, 55, 60, 58, 62],
    '京津市场': [120, 115, 125, 118, 122, 115],
    '山东市场': [45, 48, 42, 50, 46, 48],
    '上海市场': [150, 145, 158, 152, 148, 155],
  };

  const dailyData: Record<string, number[]> = {
    '东北市场': [12, 15, 11, 14, 13, 16, 14],
    '华南市场': [9, 11, 10, 12, 10, 11, 10],
    '华中市场': [8, 9, 8, 10, 9, 8, 9],
    '京津市场': [18, 20, 17, 19, 21, 18, 19],
    '山东市场': [6, 7, 6, 8, 7, 6, 7],
    '上海市场': [22, 24, 21, 23, 25, 22, 24],
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
        <h3 className="text-base font-semibold text-gray-900">各市场好评趋势分析</h3>
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
