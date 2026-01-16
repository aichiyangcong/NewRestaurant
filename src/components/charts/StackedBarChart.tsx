import ReactECharts from 'echarts-for-react';

interface StackedBarChartProps {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color: string;
  }>;
  title?: string;
  height?: number;
}

export function StackedBarChart({ categories, series, title, height = 300 }: StackedBarChartProps) {
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
    legend: {
      data: series.map((s) => s.name),
      bottom: 0,
      textStyle: {
        color: '#6b7280',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
        interval: 0,
        rotate: 30,
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
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: s.data,
      itemStyle: {
        color: s.color,
      },
    })),
  };

  return <ReactECharts option={option} style={{ height: `${height}px` }} />;
}
