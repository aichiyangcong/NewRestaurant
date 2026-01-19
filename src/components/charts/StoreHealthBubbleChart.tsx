import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import type { StoreHealthBubbleData } from '../../data/storeAnalysisData';

interface StoreHealthBubbleChartProps {
  data: StoreHealthBubbleData[];
  onStoreClick?: (storeId: string) => void;
}

export function StoreHealthBubbleChart({ data, onStoreClick }: StoreHealthBubbleChartProps) {
  const option = useMemo(() => {
    const seriesData = data.map((store) => {
      let color = '#3b82f6';
      if (store.riskLevel === 'risk') {
        color = '#ef4444';
      } else if (store.riskLevel === 'advantage') {
        color = '#22c55e';
      }

      return {
        value: [store.avgRating, store.negativeRate, store.reviewCount],
        name: store.storeName,
        id: store.id,
        region: store.region,
        riskLevel: store.riskLevel,
        itemStyle: {
          color,
          opacity: 0.7,
        },
      };
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const d = params.data;
          const riskLabel = d.riskLevel === 'risk' ? '风险' : d.riskLevel === 'advantage' ? '优势' : '正常';
          return `<div class="font-medium">${d.name}</div>
            <div class="text-gray-500 text-sm">${d.region}</div>
            <div class="mt-2">
              <div>平均评分: <span class="font-medium">${d.value[0]}</span></div>
              <div>差评率: <span class="font-medium">${d.value[1]}%</span></div>
              <div>评价数: <span class="font-medium">${d.value[2]}</span></div>
              <div>状态: <span class="font-medium">${riskLabel}</span></div>
            </div>`;
        },
      },
      legend: {
        data: ['风险门店', '正常门店', '优势门店'],
        bottom: 10,
        textStyle: {
          fontSize: 12,
          color: '#6B7280',
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        name: '平均评分',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 12,
          color: '#6B7280',
        },
        type: 'value',
        min: 2,
        max: 5,
        splitLine: {
          lineStyle: {
            color: '#F3F4F6',
            type: 'dashed',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#E5E7EB',
          },
        },
        axisLabel: {
          color: '#6B7280',
        },
      },
      yAxis: {
        name: '差评率 (%)',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          fontSize: 12,
          color: '#6B7280',
        },
        type: 'value',
        min: 0,
        max: 20,
        splitLine: {
          lineStyle: {
            color: '#F3F4F6',
            type: 'dashed',
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#6B7280',
        },
      },
      series: [
        {
          name: '风险门店',
          type: 'scatter',
          data: seriesData.filter((d) => d.riskLevel === 'risk'),
          symbolSize: (data: number[]) => Math.min(Math.sqrt(data[2]) * 2, 40),
          itemStyle: {
            color: '#ef4444',
            opacity: 0.7,
          },
          emphasis: {
            focus: 'self',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
        {
          name: '正常门店',
          type: 'scatter',
          data: seriesData.filter((d) => d.riskLevel === 'normal'),
          symbolSize: (data: number[]) => Math.min(Math.sqrt(data[2]) * 2, 40),
          itemStyle: {
            color: '#3b82f6',
            opacity: 0.7,
          },
          emphasis: {
            focus: 'self',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
        {
          name: '优势门店',
          type: 'scatter',
          data: seriesData.filter((d) => d.riskLevel === 'advantage'),
          symbolSize: (data: number[]) => Math.min(Math.sqrt(data[2]) * 2, 40),
          itemStyle: {
            color: '#22c55e',
            opacity: 0.7,
          },
          emphasis: {
            focus: 'self',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      ],
    };
  }, [data]);

  const handleChartClick = (params: any) => {
    if (params.data && params.data.id && onStoreClick) {
      onStoreClick(params.data.id);
    }
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '400px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      onEvents={{ click: handleChartClick }}
    />
  );
}
