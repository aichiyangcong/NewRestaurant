import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { QSCVTagL1, QSCVTagL2, QSCVTagL3 } from '../../types';

interface QSCVDrillDownChartProps {
  data: QSCVTagL1[];
  selectedL1?: string;
  selectedL2?: string;
  selectedL3?: string;
  onL1Click?: (name: string) => void;
  onL2Click?: (l1Name: string, l2Name: string) => void;
  onL3Click?: (l1Name: string, l2Name: string, l3Name: string) => void;
}

export function QSCVDrillDownChart({
  data,
  selectedL1,
  selectedL2,
  selectedL3,
  onL1Click,
  onL2Click,
  onL3Click,
}: QSCVDrillDownChartProps) {
  const option = useMemo(() => {
    let chartData: Array<{ name: string; value: number }> = [];
    let title = 'QSCV 全局归因 - 一级分类';

    if (!selectedL1) {
      chartData = data.map(item => ({ name: item.name, value: item.count }));
      title = 'QSCV 全局归因 - 一级分类';
    } else {
      const l1Item = data.find(item => item.name === selectedL1);
      if (!l1Item) return {};

      if (!selectedL2) {
        chartData = l1Item.children.map(item => ({ name: item.name, value: item.count }));
        title = `${selectedL1} - 二级分类`;
      } else {
        const l2Item = l1Item.children.find(item => item.name === selectedL2);
        if (!l2Item) return {};
        chartData = l2Item.children.map(item => ({ name: item.name, value: item.count }));
        title = `${selectedL1} > ${selectedL2} - 三级分类`;
      }
    }

    return {
      title: {
        text: title,
        left: 'left',
        textStyle: {
          fontSize: 14,
          fontWeight: 600,
          color: '#1f2937',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>提及次数: <b>${data.value}</b>`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12,
          color: '#6b7280',
        },
      },
      yAxis: {
        type: 'category',
        data: chartData.map(item => item.name),
        axisLabel: {
          fontSize: 12,
          color: '#1f2937',
          fontWeight: 500,
        },
      },
      series: [
        {
          type: 'bar',
          data: chartData.map(item => {
            const isSelected = selectedL2 && selectedL3 === item.name;
            return {
              value: item.value,
              itemStyle: {
                color: isSelected
                  ? '#dc2626'
                  : selectedL2
                  ? '#f87171'
                  : selectedL1
                  ? '#f97316'
                  : '#3b82f6',
                borderColor: isSelected ? '#991b1b' : 'transparent',
                borderWidth: isSelected ? 2 : 0,
              },
            };
          }),
          barWidth: '60%',
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            fontSize: 12,
            color: '#1f2937',
            fontWeight: 500,
          },
          emphasis: {
            itemStyle: {
              color: '#dc2626',
              borderColor: '#991b1b',
              borderWidth: 2,
            },
          },
        },
      ],
    };
  }, [data, selectedL1, selectedL2, selectedL3]);

  const handleChartClick = (params: any) => {
    if (params.componentType === 'series') {
      const clickedName = params.name;

      if (!selectedL1) {
        onL1Click?.(clickedName);
      } else if (!selectedL2) {
        onL2Click?.(selectedL1, clickedName);
      } else {
        onL3Click?.(selectedL1, selectedL2, clickedName);
      }
    }
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '400px', width: '100%' }}
      onEvents={{
        click: handleChartClick,
      }}
    />
  );
}
