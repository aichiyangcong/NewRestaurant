import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getReviewTrendData } from '../../data/negativeRateData';

interface ReviewTrendBarChartProps {
  height?: number;
}

type Granularity = 'day' | 'week' | 'month';

export function ReviewTrendBarChart({ height = 280 }: ReviewTrendBarChartProps) {
  const [granularity, setGranularity] = useState<Granularity>('month');
  const data = getReviewTrendData(granularity);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const label = params[0].axisValue;
        let content = `<div style="font-weight:600;margin-bottom:4px;">${label}</div>`;
        params.forEach((item: any) => {
          content += `<div style="display:flex;justify-content:space-between;gap:12px;">
            <span>${item.marker}${item.seriesName}</span>
            <span style="font-weight:600;">${item.value.toLocaleString()}</span>
          </div>`;
        });
        return content;
      },
    },
    legend: {
      data: ['好评数', '差评数'],
      bottom: 0,
      textStyle: {
        color: '#6b7280',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.month),
      axisLabel: {
        color: '#6b7280',
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
        formatter: (value: number) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value,
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
    },
    series: [
      {
        name: '好评数',
        type: 'bar',
        data: data.map(d => d.positiveCount),
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '35%',
        emphasis: {
          itemStyle: {
            color: '#2563eb',
          },
        },
      },
      {
        name: '差评数',
        type: 'bar',
        data: data.map(d => d.negativeCount),
        itemStyle: {
          color: '#1e3a5f',
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '35%',
        emphasis: {
          itemStyle: {
            color: '#0f172a',
          },
        },
        label: {
          show: true,
          position: 'top',
          color: '#6b7280',
          fontSize: 10,
        },
      },
    ],
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">好差评趋势分析</h3>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as Granularity[]).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                granularity === g
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {g === 'day' ? '日' : g === 'week' ? '周' : '月'}
            </button>
          ))}
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
