import ReactECharts from 'echarts-for-react';
import type { BubbleDataPoint } from '../../types';
import { RISK_CATEGORY_COLORS } from '../../data/constants';

interface BubbleScatterChartProps {
  data: BubbleDataPoint[];
  title?: string;
  height?: number;
  onBubbleClick?: (storeName: string) => void;
}

export function BubbleScatterChart({ data, title, height = 400, onBubbleClick }: BubbleScatterChartProps) {
  const categories = Array.from(new Set(data.map((d) => d.category)));

  const seriesData = categories.map((category) => ({
    name: category,
    type: 'scatter',
    data: data
      .filter((d) => d.category === category)
      .map((d) => ({
        value: [d.storeCount, d.complaintCount, d.bubbleSize],
        name: d.storeName,
      })),
    symbolSize: (val: number[]) => Math.sqrt(val[2]) * 8,
    itemStyle: {
      color: RISK_CATEGORY_COLORS[category],
      opacity: 0.7,
    },
    emphasis: {
      itemStyle: {
        opacity: 1,
        borderColor: '#333',
        borderWidth: 2,
      },
    },
  }));

  const option = {
    title: {
      text: title,
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
      },
      formatter: (params: any) => {
        const [storeCount, complaintCount, bubbleSize] = params.value;
        return `
          <div class="font-medium">${params.data.name}</div>
          <div class="text-sm text-gray-600 mt-1">
            <div>门店数量: ${storeCount}</div>
            <div>投诉量: ${complaintCount}</div>
            <div>类别: ${params.seriesName}</div>
          </div>
        `;
      },
    },
    legend: {
      data: categories,
      bottom: 0,
      textStyle: {
        color: '#6b7280',
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      name: '门店数量',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: '#6b7280',
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    yAxis: {
      name: '投诉量',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        color: '#6b7280',
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    series: seriesData,
  };

  const onEvents = onBubbleClick
    ? {
        click: (params: any) => {
          if (params.data?.name) {
            onBubbleClick(params.data.name);
          }
        },
      }
    : undefined;

  return <ReactECharts option={option} style={{ height: `${height}px` }} onEvents={onEvents} />;
}
