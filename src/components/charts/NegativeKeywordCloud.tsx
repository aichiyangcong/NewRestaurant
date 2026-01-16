import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import 'echarts-wordcloud';
import { getNegativeKeywordsByRegion, getRegionsList } from '../../data/regionalAnalysisData';

interface NegativeKeywordCloudProps {
  onKeywordClick: (keyword: string, region: string) => void;
}

export function NegativeKeywordCloud({ onKeywordClick }: NegativeKeywordCloudProps) {
  const regions = getRegionsList();
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  
  const keywords = useMemo(() => 
    getNegativeKeywordsByRegion(selectedRegion), 
    [selectedRegion]
  );

  const option = {
    tooltip: {
      show: true,
      formatter: (params: any) => {
        return `<div style="font-weight: 500;">${params.name}</div><div>出现次数: ${params.value}次</div>`;
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
      rotationRange: [-30, 30],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: () => {
          const colors = [
            '#EF4444', '#F97316', '#F59E0B', '#EAB308',
            '#84CC16', '#22C55E', '#14B8A6', '#06B6D4',
            '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6',
            '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
          ];
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
      data: keywords.map(k => ({
        name: k.name,
        value: k.value,
      })),
    }],
  };

  const handleChartClick = (params: any) => {
    if (params.name) {
      onKeywordClick(params.name, selectedRegion);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              selectedRegion === region
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {region}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-2">点击关键词查看相关评价原声</p>
      <ReactECharts 
        option={option} 
        style={{ height: '280px' }} 
        onEvents={{
          click: handleChartClick,
        }}
      />
    </div>
  );
}
