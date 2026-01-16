import ReactECharts from 'echarts-for-react';
import 'echarts-wordcloud';
import type { WordCloudItem } from '../../types';

interface WordCloudProps {
  data: WordCloudItem[];
  title?: string;
  height?: number;
  colorScheme?: 'default' | 'green' | 'red';
  onWordClick?: (word: string) => void;
}

export function WordCloud({ data, title, height = 350, colorScheme = 'default', onWordClick }: WordCloudProps) {
  const option = {
    title: {
      text: title,
      textStyle: {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      show: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
      },
      formatter: (params: any) => {
        return `${params.name}: ${params.value}`;
      },
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        keepAspect: false,
        left: 'center',
        top: 'center',
        width: '90%',
        height: '80%',
        right: null,
        bottom: null,
        sizeRange: [12, 48],
        rotationRange: [-45, 45],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'normal',
          color: () => {
            let colors: string[];

            if (colorScheme === 'green') {
              colors = [
                '#22c55e',
                '#16a34a',
                '#15803d',
                '#84cc16',
                '#65a30d',
                '#10b981',
                '#059669',
                '#14b8a6',
              ];
            } else if (colorScheme === 'red') {
              colors = [
                '#ef4444',
                '#dc2626',
                '#b91c1c',
                '#f97316',
                '#ea580c',
                '#f59e0b',
                '#d97706',
                '#fb923c',
              ];
            } else {
              colors = [
                '#ef4444',
                '#f97316',
                '#f59e0b',
                '#eab308',
                '#84cc16',
                '#22c55e',
                '#10b981',
                '#14b8a6',
                '#06b6d4',
                '#0ea5e9',
                '#3b82f6',
                '#6366f1',
                '#8b5cf6',
                '#a855f7',
                '#d946ef',
                '#ec4899',
                '#f43f5e',
              ];
            }

            return colors[Math.floor(Math.random() * colors.length)];
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333',
          },
        },
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ],
  };

  const onEvents = onWordClick
    ? {
        click: (params: any) => {
          if (params.name) {
            onWordClick(params.name);
          }
        },
      }
    : undefined;

  return <ReactECharts option={option} style={{ height: `${height}px` }} onEvents={onEvents} />;
}
