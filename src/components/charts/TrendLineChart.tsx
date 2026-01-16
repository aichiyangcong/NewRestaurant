import ReactECharts from 'echarts-for-react';
import type { TrendDataPoint } from '../../types';

interface TrendLineChartProps {
  data: TrendDataPoint[];
  title?: string;
  color?: string;
  height?: number;
}

export function TrendLineChart({ data, title, color = '#3b82f6', height = 300 }: TrendLineChartProps) {
  const option = {
    title: {
      text: title,
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.date),
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: data.map((d) => d.value),
        lineStyle: {
          color: color,
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}40` },
              { offset: 1, color: `${color}05` },
            ],
          },
        },
        itemStyle: {
          color: color,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: `${height}px` }} />;
}
