import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Award } from 'lucide-react';
import { subDays, isAfter, isBefore } from 'date-fns';
import { getStores, getReviews, calculateStoreMetrics, calculateStoreAnalysisKPI } from '../../data/mockData';
import type { StoreMetrics } from '../../types';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

type ViewType = 'distribution' | 'health' | 'execution';
type FilterType = 'all' | 'risk' | 'advantage';

export function StoreAnalysisPage() {
  const [activeView, setActiveView] = useState<ViewType>('distribution');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const stores = useMemo(() => getStores(), []);
  const reviews = useMemo(() => getReviews(), []);
  const storeMetrics = useMemo(() => calculateStoreMetrics(stores, reviews), [stores, reviews]);
  const kpi = useMemo(() => calculateStoreAnalysisKPI(storeMetrics), [storeMetrics]);

  const filteredMetrics = useMemo(() => {
    if (activeFilter === 'all') return storeMetrics;
    return storeMetrics.filter(s => s.riskLevel === activeFilter);
  }, [storeMetrics, activeFilter]);

  const handleFilterToggle = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
  };

  const renderTrendIcon = (value: number) => {
    if (value > 0.05) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < -0.05) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-24 gap-6">
        <div className="col-span-7">
          <Group1Panel
            kpi={kpi}
            activeView={activeView}
            activeFilter={activeFilter}
            onViewChange={setActiveView}
            onFilterToggle={handleFilterToggle}
            renderTrendIcon={renderTrendIcon}
          />
        </div>

        <div className="col-span-11">
          <Group2Panel
            activeView={activeView}
            kpi={kpi}
            storeMetrics={filteredMetrics}
            activeFilter={activeFilter}
            onViewChange={setActiveView}
            renderTrendIcon={renderTrendIcon}
          />
        </div>

        <div className="col-span-6">
          <Group3Panel
            activeView={activeView}
            kpi={kpi}
            storeMetrics={filteredMetrics}
            activeFilter={activeFilter}
            onViewChange={setActiveView}
            renderTrendIcon={renderTrendIcon}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeView === 'distribution' && (
          <DistributionChart storeMetrics={filteredMetrics} activeFilter={activeFilter} />
        )}
        {activeView === 'health' && (
          <HealthBubbleChart storeMetrics={filteredMetrics} activeFilter={activeFilter} />
        )}
        {activeView === 'execution' && (
          <ExecutionScatterChart storeMetrics={filteredMetrics} activeFilter={activeFilter} />
        )}
      </div>
    </div>
  );
}

interface Group1PanelProps {
  kpi: ReturnType<typeof calculateStoreAnalysisKPI>;
  activeView: ViewType;
  activeFilter: FilterType;
  onViewChange: (view: ViewType) => void;
  onFilterToggle: (filter: FilterType) => void;
  renderTrendIcon: (value: number) => JSX.Element;
}

function Group1Panel({ kpi, activeView, activeFilter, onViewChange, onFilterToggle, renderTrendIcon }: Group1PanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div
        className={`cursor-pointer rounded-lg border-2 transition-all ${
          activeView === 'distribution'
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-blue-300'
        }`}
        onClick={() => onViewChange('distribution')}
      >
        <div className="p-4">
          <div className="text-sm text-gray-600 mb-1">门店平均评分</div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-900">{kpi.avgRating}</div>
            <div className="flex items-center gap-1">
              {renderTrendIcon(kpi.avgRatingChange)}
              <span className={`text-sm font-medium ${
                kpi.avgRatingChange > 0 ? 'text-green-600' : kpi.avgRatingChange < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {kpi.avgRatingChange > 0 ? '+' : ''}{kpi.avgRatingChange}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200"></div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className={`cursor-pointer rounded-lg border-2 transition-all ${
            activeFilter === 'risk'
              ? 'bg-red-600 border-red-600 shadow-lg text-white'
              : 'bg-red-50 border-red-200 text-red-600 hover:border-red-400'
          }`}
          onClick={() => onFilterToggle('risk')}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <div className="text-xs font-medium">风险门店</div>
            </div>
            <div className="text-2xl font-bold">{kpi.riskStoreCount}</div>
            <div className={`text-xs mt-1 ${
              activeFilter === 'risk' ? 'text-red-100' : 'text-red-500'
            }`}>
              {kpi.riskStoreCountChange > 0 ? '+' : ''}{kpi.riskStoreCountChange} 环比
            </div>
          </div>
        </div>

        <div
          className={`cursor-pointer rounded-lg border-2 transition-all ${
            activeFilter === 'advantage'
              ? 'bg-green-600 border-green-600 shadow-lg text-white'
              : 'bg-green-50 border-green-200 text-green-600 hover:border-green-400'
          }`}
          onClick={() => onFilterToggle('advantage')}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4" />
              <div className="text-xs font-medium">优势门店</div>
            </div>
            <div className="text-2xl font-bold">{kpi.advantageStoreCount}</div>
            <div className={`text-xs mt-1 ${
              activeFilter === 'advantage' ? 'text-green-100' : 'text-green-500'
            }`}>
              {kpi.advantageStoreCountChange > 0 ? '+' : ''}{kpi.advantageStoreCountChange} 环比
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Group2PanelProps {
  activeView: ViewType;
  kpi: ReturnType<typeof calculateStoreAnalysisKPI>;
  storeMetrics: StoreMetrics[];
  activeFilter: FilterType;
  onViewChange: (view: ViewType) => void;
  renderTrendIcon: (value: number) => JSX.Element;
}

function Group2Panel({ activeView, kpi, onViewChange, renderTrendIcon }: Group2PanelProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer border-2 transition-all ${
        activeView === 'health'
          ? 'border-blue-500 shadow-md'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onViewChange('health')}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">评分健康度</h3>
        <p className="text-sm text-gray-500">点击查看气泡分布</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">新增评分</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{kpi.totalNewReviews}</div>
            <div className="flex items-center gap-1">
              {renderTrendIcon(kpi.totalNewReviewsChange / kpi.totalNewReviews)}
              <span className="text-sm text-gray-600">
                {kpi.totalNewReviewsChange > 0 ? '+' : ''}{kpi.totalNewReviewsChange}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">差评率</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{kpi.avgNegativeRate}%</div>
            <div className="flex items-center gap-1">
              {renderTrendIcon(-kpi.avgNegativeRateChange)}
              <span className="text-sm text-gray-600">
                {kpi.avgNegativeRateChange > 0 ? '+' : ''}{kpi.avgNegativeRateChange}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">评价量</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{kpi.totalNewReviews}</div>
            <div className="flex items-center gap-1">
              {renderTrendIcon(kpi.totalNewReviewsChange / kpi.totalNewReviews)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Group3PanelProps {
  activeView: ViewType;
  kpi: ReturnType<typeof calculateStoreAnalysisKPI>;
  storeMetrics: StoreMetrics[];
  activeFilter: FilterType;
  onViewChange: (view: ViewType) => void;
  renderTrendIcon: (value: number) => JSX.Element;
}

function Group3Panel({ activeView, kpi, onViewChange, renderTrendIcon }: Group3PanelProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer border-2 transition-all ${
        activeView === 'execution'
          ? 'border-blue-500 shadow-md'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onViewChange('execution')}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">执行力</h3>
        <p className="text-sm text-gray-500">点击查看散点图</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">平均回复率</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{kpi.avgReplyRate}%</div>
            <div className="flex items-center gap-1">
              {renderTrendIcon(kpi.avgReplyRateChange)}
              <span className="text-sm text-gray-600">
                {kpi.avgReplyRateChange > 0 ? '+' : ''}{kpi.avgReplyRateChange}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChartProps {
  storeMetrics: StoreMetrics[];
  activeFilter: FilterType;
}

function DistributionChart({ storeMetrics, activeFilter }: ChartProps) {
  const option: EChartsOption = useMemo(() => {
    const bins = [
      { range: '<3.8', min: 0, max: 3.8 },
      { range: '3.8~4.2', min: 3.8, max: 4.2 },
      { range: '4.2~4.6', min: 4.2, max: 4.6 },
      { range: '4.6~5.0', min: 4.6, max: 5.1 },
    ];

    const stores = getStores();
    const reviews = getReviews();
    const currentMetrics = calculateStoreMetrics(stores, reviews);

    const now = new Date();
    const last7Days = subDays(now, 7);
    const last14Days = subDays(now, 14);

    const previousReviews = reviews.filter(r =>
      isAfter(r.createTime, last14Days) && isBefore(r.createTime, last7Days)
    );
    const previousMetrics = calculateStoreMetrics(stores, previousReviews);

    const currentData = bins.map(bin => {
      const count = currentMetrics.filter(s => s.avgRating >= bin.min && s.avgRating < bin.max).length;
      return count;
    });

    const previousData = bins.map(bin => {
      const count = previousMetrics.filter(s => s.avgRating >= bin.min && s.avgRating < bin.max).length;
      return count;
    });

    const trendData = currentData.map((current, index) => {
      const previous = previousData[index];
      return previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : 0;
    });

    const colors = currentData.map((_, index) => {
      if (activeFilter === 'risk' && index === 0) return '#dc2626';
      if (activeFilter === 'advantage' && index === 3) return '#16a34a';
      if (activeFilter === 'all') {
        if (index === 0) return '#dc2626';
        if (index === 3) return '#16a34a';
        return '#3b82f6';
      }
      return '#94a3b8';
    });

    return {
      title: { text: '门店评分分布', left: 'center' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['门店数量', '环比趋势'],
        top: 30,
      },
      xAxis: {
        type: 'category',
        data: bins.map(b => b.range),
        axisLabel: { rotate: 0 },
      },
      yAxis: [
        {
          type: 'value',
          name: '门店数量',
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: '环比(%)',
          position: 'right',
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [
        {
          name: '门店数量',
          type: 'bar',
          yAxisIndex: 0,
          data: currentData.map((value, index) => ({
            value,
            itemStyle: {
              color: colors[index],
              opacity: activeFilter === 'all' ? 1 : (
                (activeFilter === 'risk' && index === 0) || (activeFilter === 'advantage' && index === 3) ? 1 : 0.3
              ),
            },
          })),
          barWidth: '50%',
        },
        {
          name: '环比趋势',
          type: 'line',
          yAxisIndex: 1,
          data: trendData,
          smooth: true,
          lineStyle: {
            color: '#f59e0b',
            width: 3,
          },
          itemStyle: {
            color: '#f59e0b',
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#f59e0b',
            fontWeight: 'bold',
          },
        },
      ],
    };
  }, [storeMetrics, activeFilter]);

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

function HealthBubbleChart({ storeMetrics, activeFilter }: ChartProps) {
  const option: EChartsOption = useMemo(() => {
    const data = storeMetrics.map(s => {
      const isHighlighted = activeFilter === 'all' ||
        (activeFilter === 'risk' && s.riskLevel === 'risk') ||
        (activeFilter === 'advantage' && s.riskLevel === 'advantage');

      return {
        value: [s.avgRating, s.negativeRate, s.totalReviews],
        name: s.storeName,
        itemStyle: {
          color: s.riskLevel === 'risk' ? '#dc2626' : s.riskLevel === 'advantage' ? '#16a34a' : '#3b82f6',
          opacity: isHighlighted ? 0.8 : 0.2,
        },
      };
    });

    return {
      title: { text: '健康度气泡图（评分 vs 差评率）', left: 'center' },
      tooltip: {
        formatter: (params: any) => {
          const data = params.data;
          return `${data.name}<br/>评分: ${data.value[0]}<br/>差评率: ${data.value[1]}%<br/>评价量: ${data.value[2]}`;
        },
      },
      xAxis: {
        name: '平均评分',
        min: 1,
        max: 5,
        splitLine: { show: true },
      },
      yAxis: {
        name: '差评率 (%)',
        splitLine: { show: true },
      },
      series: [
        {
          type: 'scatter',
          data,
          symbolSize: (data: number[]) => Math.sqrt(data[2]) * 2,
        },
      ],
    };
  }, [storeMetrics, activeFilter]);

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

function ExecutionScatterChart({ storeMetrics, activeFilter }: ChartProps) {
  const option: EChartsOption = useMemo(() => {
    const data = storeMetrics.map(s => {
      const isHighlighted = activeFilter === 'all' ||
        (activeFilter === 'risk' && s.riskLevel === 'risk') ||
        (activeFilter === 'advantage' && s.riskLevel === 'advantage');

      return {
        value: [s.replyRate, s.avgRating],
        name: s.storeName,
        itemStyle: {
          color: s.riskLevel === 'risk' ? '#dc2626' : s.riskLevel === 'advantage' ? '#16a34a' : '#3b82f6',
          opacity: isHighlighted ? 0.8 : 0.2,
        },
      };
    });

    return {
      title: { text: '执行力散点图（回复率 vs 评分）', left: 'center' },
      tooltip: {
        formatter: (params: any) => {
          const data = params.data;
          return `${data.name}<br/>回复率: ${data.value[0]}%<br/>评分: ${data.value[1]}`;
        },
      },
      xAxis: {
        name: '回复率 (%)',
        min: 0,
        max: 100,
        splitLine: { show: true },
      },
      yAxis: {
        name: '平均评分',
        min: 1,
        max: 5,
        splitLine: { show: true },
      },
      series: [
        {
          type: 'scatter',
          data,
          symbolSize: 8,
        },
      ],
    };
  }, [storeMetrics, activeFilter]);

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}
