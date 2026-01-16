import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import { getRegionalNegativeTrendData, getRegionsList, NegativeMetricType } from '../../data/regionalAnalysisData';

type TabType = 'negativeCount' | 'negativeRate' | 'negativePerTenThousand';

const TAB_CONFIG: { key: TabType; label: string; unit: string }[] = [
  { key: 'negativeCount', label: '差评数', unit: '条' },
  { key: 'negativeRate', label: '差评率', unit: '%' },
  { key: 'negativePerTenThousand', label: '万元差评次数', unit: '次/万元' },
];

const REGION_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
];

export function NegativeAnalysisTrendChart() {
  const [activeTab, setActiveTab] = useState<TabType>('negativeCount');
  
  const regions = getRegionsList();
  const data = useMemo(() => getRegionalNegativeTrendData(activeTab as NegativeMetricType), [activeTab]);
  
  const currentTabConfig = TAB_CONFIG.find(t => t.key === activeTab)!;

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
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 4px 0; min-width: 150px;">
              <span style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                ${param.seriesName}
              </span>
              <span style="font-weight: 500; margin-left: 16px;">${param.value}${currentTabConfig.unit}</span>
            </div>
          `;
        });
        return result;
      },
    },
    legend: {
      data: regions,
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
        formatter: (value: number) => {
          if (activeTab === 'negativeCount') {
            return value.toString();
          }
          return value.toFixed(1);
        },
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed',
        },
      },
    },
    series: regions.map((region, index) => ({
      name: region,
      type: 'line',
      data: data.map(d => d[region]),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
        color: REGION_COLORS[index],
      },
      itemStyle: {
        color: REGION_COLORS[index],
      },
    })),
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ReactECharts option={option} style={{ height: '280px' }} />
    </div>
  );
}
