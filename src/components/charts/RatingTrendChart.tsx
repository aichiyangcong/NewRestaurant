import ReactECharts from 'echarts-for-react';

interface TrendDataPoint {
  month: string;
  total: number;
  meituan: number;
  dianping: number;
}

interface RatingTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export function RatingTrendChart({ data, height = 300 }: RatingTrendChartProps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
      },
    },
    legend: {
      data: ['总评分', '美团', '大众点评'],
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
      min: 3.5,
      max: 5,
      interval: 0.5,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#6b7280',
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
    },
    series: [
      {
        name: '总评分',
        type: 'line',
        data: data.map(d => d.total),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#1e293b',
        },
        itemStyle: {
          color: '#1e293b',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          color: '#374151',
          fontSize: 10,
        },
      },
      {
        name: '美团',
        type: 'line',
        data: data.map(d => d.meituan),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          width: 1.5,
          color: '#f97316',
          type: 'dashed',
        },
        itemStyle: {
          color: '#f97316',
        },
      },
      {
        name: '大众点评',
        type: 'line',
        data: data.map(d => d.dianping),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          width: 1.5,
          color: '#3b82f6',
          type: 'dashed',
        },
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">星级月趋势分析</h3>
      <ReactECharts option={option} style={{ height }} />
    </div>
  );
}
