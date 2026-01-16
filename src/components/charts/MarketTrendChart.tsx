import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MarketTrendData {
  market: string;
  data: number[];
}

interface MarketTrendChartProps {
  markets: MarketTrendData[];
  months: string[];
  benchmarkValue?: number;
  height?: number;
}

export function MarketTrendChart({ 
  markets, 
  months, 
  benchmarkValue = 4.5,
  height = 350
}: MarketTrendChartProps) {
  const [expanded, setExpanded] = useState(false);
  const displayMarkets = expanded ? markets : markets.slice(0, 5);

  const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
      },
      formatter: (params: any) => {
        let html = `<div class="font-medium mb-2">${params[0].axisValue}</div>`;
        params.forEach((p: any) => {
          html += `<div class="flex items-center gap-2">
            <span style="background:${p.color};width:8px;height:8px;border-radius:50%;display:inline-block"></span>
            <span>${p.seriesName}: ${p.value.toFixed(2)}</span>
          </div>`;
        });
        return html;
      },
    },
    legend: {
      data: displayMarkets.map(m => m.market),
      bottom: 0,
      textStyle: {
        color: '#6b7280',
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 8,
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
      data: months,
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
      min: 3.8,
      max: 4.8,
      interval: 0.2,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#6b7280',
        formatter: (value: number) => value.toFixed(1),
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
    },
    series: [
      ...displayMarkets.map((market, idx) => ({
        name: market.market,
        type: 'line',
        data: market.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: colors[idx % colors.length],
        },
        itemStyle: {
          color: colors[idx % colors.length],
        },
      })),
      {
        name: '基准线',
        type: 'line',
        data: months.map(() => benchmarkValue),
        lineStyle: {
          width: 2,
          color: '#3b82f6',
          type: 'dashed',
        },
        symbol: 'none',
        label: {
          show: false,
        },
      },
    ],
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">各市场星级月趋势分析</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-8 border-t-2 border-dashed border-blue-500"></span>
          <span>基准线 {benchmarkValue}</span>
        </div>
      </div>
      
      <ReactECharts option={option} style={{ height }} />

      {markets.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors mx-auto"
        >
          {expanded ? (
            <>
              <span>收起</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>展开更多 ({markets.length - 5}个市场)</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
