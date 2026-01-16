import ReactECharts from 'echarts-for-react';

interface DistributionDataPoint {
  month: string;
  below3: number;
  from3to35: number;
  from4: number;
  above45: number;
  below3Pct: number;
  from3to35Pct: number;
  from4Pct: number;
  above45Pct: number;
}

interface StoreRatingDistributionChartProps {
  data: DistributionDataPoint[];
  height?: number;
}

export function StoreRatingDistributionChart({ data, height = 300 }: StoreRatingDistributionChartProps) {
  const option = {
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
      formatter: (params: any) => {
        const month = params[0].axisValue;
        const dataIndex = params[0].dataIndex;
        const item = data[dataIndex];
        let html = `<div class="font-medium mb-2">${month}</div>`;
        params.forEach((p: any) => {
          const pctKey = p.seriesName === '<3' ? 'below3Pct' : 
                        p.seriesName === '3-3.5' ? 'from3to35Pct' :
                        p.seriesName === '4' ? 'from4Pct' : 'above45Pct';
          html += `<div class="flex items-center gap-2">
            <span style="background:${p.color};width:8px;height:8px;border-radius:50%;display:inline-block"></span>
            <span>${p.seriesName}: ${p.value}家 (${item[pctKey as keyof DistributionDataPoint]}%)</span>
          </div>`;
        });
        return html;
      },
    },
    legend: {
      data: ['<3', '3-3.5', '4', '4.5+'],
      bottom: 0,
      textStyle: {
        color: '#6b7280',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
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
        name: '<3',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.below3),
        itemStyle: {
          color: '#ef4444',
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const pct = data[params.dataIndex].below3Pct;
            return pct > 5 ? `${pct}%` : '';
          },
          color: '#fff',
          fontSize: 10,
        },
      },
      {
        name: '3-3.5',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.from3to35),
        itemStyle: {
          color: '#f59e0b',
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const pct = data[params.dataIndex].from3to35Pct;
            return pct > 5 ? `${pct}%` : '';
          },
          color: '#fff',
          fontSize: 10,
        },
      },
      {
        name: '4',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.from4),
        itemStyle: {
          color: '#60a5fa',
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const pct = data[params.dataIndex].from4Pct;
            return pct > 5 ? `${pct}%` : '';
          },
          color: '#fff',
          fontSize: 10,
        },
      },
      {
        name: '4.5+',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.above45),
        itemStyle: {
          color: '#3b82f6',
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const pct = data[params.dataIndex].above45Pct;
            return pct > 5 ? `${pct}%` : '';
          },
          color: '#fff',
          fontSize: 10,
        },
      },
    ],
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">门店数月趋势（星级分段）</h3>
      <ReactECharts option={option} style={{ height }} />
    </div>
  );
}
