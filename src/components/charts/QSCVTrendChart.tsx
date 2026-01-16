import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import { getQSCVTrendDataByRegion, getQSCVTagNames, getRegionsList } from '../../data/regionalAnalysisData';

const TAG_COLORS = {
  'Q-品质': '#EF4444',
  'S-服务': '#F59E0B',
  'C-清洁': '#10B981',
  'V-价值': '#3B82F6',
  '食材新鲜度': '#F87171',
  '口味问题': '#FB923C',
  '菜品温度': '#FBBF24',
  '分量不足': '#A3E635',
  '服务态度': '#34D399',
  '上菜速度': '#2DD4BF',
  '点餐问题': '#22D3EE',
  '结账问题': '#38BDF8',
  '餐具卫生': '#60A5FA',
  '环境整洁': '#818CF8',
  '异物问题': '#A78BFA',
  '性价比低': '#C084FC',
  '优惠问题': '#E879F9',
  '会员权益': '#F472B6',
};

const DEFAULT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export function QSCVTrendChart() {
  const regions = getRegionsList();
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [drillLevel, setDrillLevel] = useState<'L1' | 'L2'>('L1');
  const [selectedL1Tag, setSelectedL1Tag] = useState<string | null>(null);

  const tags = useMemo(() => 
    getQSCVTagNames(drillLevel, selectedL1Tag || undefined), 
    [drillLevel, selectedL1Tag]
  );
  
  const data = useMemo(() => 
    getQSCVTrendDataByRegion(selectedRegion, drillLevel, selectedL1Tag || undefined), 
    [selectedRegion, drillLevel, selectedL1Tag]
  );

  const handleChartClick = (params: any) => {
    if (drillLevel === 'L1' && params.seriesName) {
      setSelectedL1Tag(params.seriesName);
      setDrillLevel('L2');
    }
  };

  const handleBack = () => {
    setDrillLevel('L1');
    setSelectedL1Tag(null);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setDrillLevel('L1');
    setSelectedL1Tag(null);
  };

  const getColor = (tag: string, index: number) => {
    return TAG_COLORS[tag as keyof typeof TAG_COLORS] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151',
      },
      formatter: (params: any[]) => {
        let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        params.forEach((param) => {
          result += `
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 4px 0; min-width: 140px;">
              <span style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                ${param.seriesName}
              </span>
              <span style="font-weight: 500; margin-left: 16px;">${param.value}条</span>
            </div>
          `;
        });
        return result;
      },
    },
    legend: {
      data: tags,
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        fontSize: 12,
        color: '#6b7280',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
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
        fontSize: 12,
      },
      axisTick: {
        show: false,
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
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed',
        },
      },
    },
    series: tags.map((tag, index) => ({
      name: tag,
      type: 'line',
      data: data.map(d => d[tag]),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
        color: getColor(tag, index),
      },
      itemStyle: {
        color: getColor(tag, index),
      },
    })),
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionChange(region)}
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
      
      {drillLevel === 'L2' && selectedL1Tag && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            返回
          </button>
          <span className="text-sm text-gray-500">|</span>
          <span className="text-sm font-medium text-gray-700">{selectedL1Tag}</span>
        </div>
      )}
      {drillLevel === 'L1' && (
        <p className="text-xs text-gray-500 mb-2">点击折线可查看二级标签详情</p>
      )}
      <ReactECharts 
        option={option} 
        style={{ height: '250px' }} 
        onEvents={{
          click: handleChartClick,
        }}
      />
    </div>
  );
}
