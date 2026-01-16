import ReactECharts from 'echarts-for-react';
import type { DistributionDataPoint } from '../../types';

interface DistributionBarChartProps {
  data: DistributionDataPoint[];
  title?: string;
  color?: string;
  height?: number;
  horizontal?: boolean;
}

export function DistributionBarChart({
  data,
  title,
  color = '#3b82f6',
  height = 300,
  horizontal = false,
}: DistributionBarChartProps) {
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
      axisPointer: {
        type: 'shadow',
      },
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
      type: horizontal ? 'value' : 'category',
      data: horizontal ? undefined : data.map((d) => d.name),
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
        interval: 0,
        rotate: horizontal ? 0 : 30,
      },
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      data: horizontal ? data.map((d) => d.name) : undefined,
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
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: {
          color: color,
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
        },
        barMaxWidth: 40,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: `${height}px` }} />;
}
