import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import type { WordCloudItem } from '../../data/negativeRateData';

interface NegativeWordCloudProps {
  data: WordCloudItem[];
  mode: 'positive' | 'negative';
  height?: number;
  onWordClick?: (word: string) => void;
  hideHeader?: boolean;
}

export function NegativeWordCloud({ data, mode, height = 280, onWordClick, hideHeader = false }: NegativeWordCloudProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const colorPalette = mode === 'negative' 
      ? ['#dc2626', '#ef4444', '#f97316', '#fb923c', '#fbbf24', '#fcd34d']
      : ['#059669', '#10b981', '#34d399', '#6ee7b7', '#3b82f6', '#60a5fa'];

    const option = {
      tooltip: {
        show: true,
        formatter: (params: any) => {
          return `<div style="font-weight:600;">${params.name}</div>
            <div>出现 ${params.value} 次</div>
            <div style="color:#9ca3af;font-size:11px;">点击查看相关评价</div>`;
        },
      },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        sizeRange: [14, 48],
        rotationRange: [-45, 45],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: () => colorPalette[Math.floor(Math.random() * colorPalette.length)],
        },
        emphasis: {
          textStyle: {
            shadowBlur: 10,
            shadowColor: mode === 'negative' ? 'rgba(220, 38, 38, 0.5)' : 'rgba(16, 185, 129, 0.5)',
          },
        },
        data: data.map(item => ({
          name: item.name,
          value: item.value,
        })),
      }],
    };

    chartInstance.current.setOption(option);

    chartInstance.current.on('click', (params: any) => {
      if (params.componentType === 'series' && onWordClick) {
        onWordClick(params.name);
      }
    });

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, mode, onWordClick]);

  return (
    <div>
      {!hideHeader && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              消费者{mode === 'negative' ? '差评' : '好评'}高频关键词词云
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-2">点击可查看用户原声</p>
        </>
      )}
      <div ref={chartRef} style={{ height }} />
    </div>
  );
}
