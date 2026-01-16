import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronRight } from 'lucide-react';
import type { DimensionItem, TagL2Item, TagL3Item } from '../../data/negativeRateData';
import { getTagL2Data, getTagL3Data } from '../../data/negativeRateData';

interface DimensionAnalysisChartProps {
  data: DimensionItem[];
  height?: number;
  onStoreClick?: (storeId: string, storeName: string) => void;
}

type DrillLevel = 'l1' | 'l2' | 'l3';

interface DrillState {
  level: DrillLevel;
  l1Tag?: string;
  l2Tag?: string;
}

export function DimensionAnalysisChart({ data, height = 320, onStoreClick }: DimensionAnalysisChartProps) {
  const [drillState, setDrillState] = useState<DrillState>({ level: 'l1' });
  const [l2Data, setL2Data] = useState<TagL2Item[]>([]);
  const [l3Data, setL3Data] = useState<TagL3Item[]>([]);

  const handleL1Click = (dimension: string) => {
    const tagData = getTagL2Data(dimension);
    setL2Data(tagData);
    setDrillState({ level: 'l2', l1Tag: dimension });
  };

  const handleL2Click = (l2Tag: string) => {
    if (!drillState.l1Tag) return;
    const tagData = getTagL3Data(drillState.l1Tag, l2Tag);
    setL3Data(tagData);
    setDrillState({ ...drillState, level: 'l3', l2Tag });
  };

  const handleBreadcrumbClick = (level: DrillLevel) => {
    if (level === 'l1') {
      setDrillState({ level: 'l1' });
      setL2Data([]);
      setL3Data([]);
    } else if (level === 'l2') {
      setDrillState({ level: 'l2', l1Tag: drillState.l1Tag });
      setL3Data([]);
    }
  };

  const renderBreadcrumb = () => {
    if (drillState.level === 'l1') return null;
    
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <button 
          className="hover:text-blue-600 transition-colors"
          onClick={() => handleBreadcrumbClick('l1')}
        >
          差评归因
        </button>
        {drillState.l1Tag && (
          <>
            <ChevronRight className="w-4 h-4" />
            <button 
              className={`hover:text-blue-600 transition-colors ${drillState.level === 'l2' ? 'text-gray-900 font-medium' : ''}`}
              onClick={() => handleBreadcrumbClick('l2')}
            >
              {drillState.l1Tag}
            </button>
          </>
        )}
        {drillState.l2Tag && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{drillState.l2Tag}</span>
          </>
        )}
      </div>
    );
  };

  const renderL1Chart = () => {
    const chartData = data.map(d => {
      const total = d.positiveCount + d.negativeCount;
      return {
        ...d,
        positivePercent: Math.round(d.positiveCount / total * 100),
        negativePercent: Math.round(d.negativeCount / total * 100),
      };
    });

    const maxPercent = Math.max(
      ...chartData.map(d => Math.max(d.positivePercent, d.negativePercent))
    );
    const axisMax = Math.ceil(maxPercent / 10) * 10 + 10;

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const dimension = params[0].axisValue;
          const item = data.find(d => d.dimension === dimension);
          if (!item) return '';
          const total = item.positiveCount + item.negativeCount;
          return `<div style="font-weight:600;margin-bottom:4px;">${dimension}</div>
            <div><span style="color:#10b981;">好评提及：</span>${item.positiveCount}条 (${Math.round(item.positiveCount / total * 100)}%)</div>
            <div><span style="color:#ef4444;">差评提及：</span>${item.negativeCount}条 (${Math.round(item.negativeCount / total * 100)}%)</div>`;
        },
      },
      grid: {
        left: '3%',
        right: '12%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        position: 'top',
        axisLabel: {
          color: '#6b7280',
          formatter: (value: number) => `${Math.abs(value)}%`,
        },
        splitLine: {
          lineStyle: { color: '#f3f4f6' },
        },
        min: -axisMax,
        max: axisMax,
      },
      yAxis: {
        type: 'category',
        data: chartData.map(d => d.dimension),
        axisLabel: {
          color: '#374151',
          fontWeight: 500,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: '好评',
          type: 'bar',
          stack: 'positive',
          data: chartData.map(d => ({
            value: d.positivePercent,
            itemStyle: { color: '#10b981' },
          })),
          barWidth: '50%',
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => `${params.value}%`,
            color: '#10b981',
            fontSize: 11,
          },
        },
        {
          name: '差评',
          type: 'bar',
          stack: 'negative',
          data: chartData.map(d => ({
            value: -d.negativePercent,
            itemStyle: { color: '#ef4444' },
          })),
          barWidth: '50%',
          label: {
            show: true,
            position: 'left',
            formatter: (params: any) => `${Math.abs(params.value)}%`,
            color: '#ef4444',
            fontSize: 11,
          },
        },
      ],
    };

    const handleClick = (params: any) => {
      if (params.componentType === 'series') {
        handleL1Click(params.name);
      }
    };

    return (
      <ReactECharts
        option={option}
        style={{ height: height - 60 }}
        opts={{ renderer: 'canvas' }}
        onEvents={{ click: handleClick }}
      />
    );
  };

  const renderL2Chart = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
      },
      yAxis: {
        type: 'category',
        data: l2Data.map(d => d.name),
        axisLabel: { color: '#374151' },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: '好评提及',
          type: 'bar',
          data: l2Data.map(d => ({ value: d.positiveCount, itemStyle: { color: '#10b981' } })),
          barWidth: '35%',
        },
        {
          name: '差评提及',
          type: 'bar',
          data: l2Data.map(d => ({ value: d.negativeCount, itemStyle: { color: '#ef4444' } })),
          barWidth: '35%',
        },
      ],
    };

    const handleClick = (params: any) => {
      if (params.componentType === 'series') {
        handleL2Click(params.name);
      }
    };

    return (
      <ReactECharts
        option={option}
        style={{ height: height - 60 }}
        opts={{ renderer: 'canvas' }}
        onEvents={{ click: handleClick }}
      />
    );
  };

  const renderL3Table = () => {
    return (
      <div className="overflow-auto" style={{ height: height - 60 }}>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-2 px-3 font-medium text-gray-600">三级标签</th>
              <th className="text-left py-2 px-3 font-medium text-gray-600">提及次数</th>
              <th className="text-left py-2 px-3 font-medium text-gray-600">TOP门店</th>
            </tr>
          </thead>
          <tbody>
            {l3Data.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">{item.name}</td>
                <td className="py-2 px-3 text-red-600 font-medium">{item.count}</td>
                <td className="py-2 px-3">
                  <div className="flex flex-wrap gap-1">
                    {item.stores.slice(0, 3).map((store, i) => (
                      <button
                        key={i}
                        className="text-blue-600 hover:underline text-xs"
                        onClick={() => onStoreClick?.(store.storeId, store.storeName)}
                      >
                        {store.storeName}({store.count})
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {l3Data.length === 0 && (
          <div className="text-center text-gray-400 py-8">该维度下暂无数据</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-base font-semibold text-gray-900">
          {drillState.level === 'l1' ? '一级标签的提及次数' : 
           drillState.level === 'l2' ? '二级标签分布' : '三级标签详情'}
        </h3>
      </div>
      {renderBreadcrumb()}
      {drillState.level === 'l1' && renderL1Chart()}
      {drillState.level === 'l2' && renderL2Chart()}
      {drillState.level === 'l3' && renderL3Table()}
      
      {drillState.level === 'l1' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
              <span className="text-gray-600">好评提及</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
              <span className="text-gray-600">差评提及</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
