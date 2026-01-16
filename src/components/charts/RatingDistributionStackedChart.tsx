import ReactECharts from 'echarts-for-react';
import type { MonthlyRatingDistribution } from '../../data/regionalAnalysisData';

interface RatingDistributionStackedChartProps {
  data: MonthlyRatingDistribution[];
}

export function RatingDistributionStackedChart({ data }: RatingDistributionStackedChartProps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any[]) => {
        const month = params[0].axisValue;
        let total = 0;
        let content = `<div class="font-medium mb-2">${month}</div>`;
        params.forEach((item: any) => {
          total += item.value;
          const percentage = ((item.value / (data.find(d => d.month === month) ? 
            (data.find(d => d.month === month)!.star5 + data.find(d => d.month === month)!.star4 + 
             data.find(d => d.month === month)!.star3 + data.find(d => d.month === month)!.star2 + 
             data.find(d => d.month === month)!.star1) : 1)) * 100).toFixed(1);
          content += `<div class="flex items-center gap-2">
            <span style="display:inline-block;width:10px;height:10px;background:${item.color};border-radius:2px;"></span>
            <span>${item.seriesName}: ${item.value}家 (${percentage}%)</span>
          </div>`;
        });
        return content;
      },
    },
    legend: {
      data: ['5星', '4星', '3星', '2星', '1星'],
      bottom: 0,
      textStyle: {
        fontSize: 12,
        color: '#6B7280',
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
          color: '#E5E7EB',
        },
      },
      axisLabel: {
        color: '#6B7280',
      },
    },
    yAxis: {
      type: 'value',
      name: '门店数',
      nameTextStyle: {
        color: '#9CA3AF',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#6B7280',
      },
    },
    series: [
      {
        name: '5星',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: data.map(d => d.star5),
        itemStyle: {
          color: '#22C55E',
        },
        barWidth: 30,
      },
      {
        name: '4星',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: data.map(d => d.star4),
        itemStyle: {
          color: '#84CC16',
        },
      },
      {
        name: '3星',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: data.map(d => d.star3),
        itemStyle: {
          color: '#FACC15',
        },
      },
      {
        name: '2星',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: data.map(d => d.star2),
        itemStyle: {
          color: '#FB923C',
        },
      },
      {
        name: '1星',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: data.map(d => d.star1),
        itemStyle: {
          color: '#EF4444',
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '300px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
