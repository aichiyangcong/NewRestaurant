import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronLeft } from 'lucide-react';
import type { QSCVTagData } from '../../data/regionalAnalysisData';

interface QSCVStackedBarChartProps {
  data: QSCVTagData[];
}

export function QSCVStackedBarChart({ data }: QSCVStackedBarChartProps) {
  const [selectedTag, setSelectedTag] = useState<QSCVTagData | null>(null);

  const displayData = selectedTag ? selectedTag.children || [] : data;
  const colors = selectedTag 
    ? ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE']
    : ['#3B82F6', '#22C55E', '#FACC15', '#F97316'];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any[]) => {
        const item = params[0];
        return `<div>
          <div class="font-medium">${item.name}</div>
          <div>数量: ${item.value}条</div>
          <div>占比: ${displayData.find(d => d.name === item.name)?.percentage || 0}%</div>
        </div>`;
      },
    },
    grid: {
      left: '3%',
      right: '15%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
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
    yAxis: {
      type: 'category',
      data: displayData.map(d => d.name),
      axisLine: {
        lineStyle: {
          color: '#E5E7EB',
        },
      },
      axisLabel: {
        color: '#374151',
        fontSize: 13,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        type: 'bar',
        data: displayData.map((d, index) => ({
          value: d.count,
          itemStyle: {
            color: colors[index % colors.length],
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: 24,
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const item = displayData[params.dataIndex];
            return `${item.percentage}%`;
          },
          color: '#6B7280',
          fontSize: 12,
        },
      },
    ],
  };

  const handleClick = (params: any) => {
    if (!selectedTag) {
      const clicked = data.find(d => d.name === params.name);
      if (clicked && clicked.children && clicked.children.length > 0) {
        setSelectedTag(clicked);
      }
    }
  };

  return (
    <div>
      {selectedTag && (
        <button
          onClick={() => setSelectedTag(null)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          返回一级标签
        </button>
      )}
      {!selectedTag && (
        <p className="text-xs text-gray-500 mb-2">点击标签查看二级标签明细</p>
      )}
      <ReactECharts
        option={option}
        style={{ height: '240px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: handleClick,
        }}
      />
    </div>
  );
}
