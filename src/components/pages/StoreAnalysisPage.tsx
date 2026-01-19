import { useState, useMemo } from 'react';
import { Star, AlertTriangle, Award, MessageSquare, ThumbsDown, Clock } from 'lucide-react';
import { GlobalFilters } from '../layout/GlobalFilters';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { RatingDistributionStackedChart } from '../charts/RatingDistributionStackedChart';
import { StoreHealthBubbleChart } from '../charts/StoreHealthBubbleChart';
import { StoreExecutionScatterChart } from '../charts/StoreExecutionScatterChart';
import { StoreGlobalListTable } from '../charts/StoreGlobalListTable';
import { StoreDetailDrawer } from '../common/StoreDetailDrawer';
import { useDashboardStore } from '../../store/dashboardStore';
import { getStoreDetailById } from '../../data/storeAnalysisData';
import {
  getStoreAnalysisMetrics,
  getStoreAnalysisAISummary,
  getMonthlyStoreRatingDistribution,
  getStoreList,
  getStoreHealthBubbleData,
  getStoreExecutionScatterData,
} from '../../data/storeAnalysisData';

type ViewGroup = 'rating' | 'health' | 'execution';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

function MetricCard({ title, value, change, changeLabel = '', icon, color, isActive, isDimmed, onClick }: MetricCardProps) {
  const borderColors = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    orange: 'border-l-orange-500',
    red: 'border-l-red-500',
    purple: 'border-l-purple-500',
  };

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
  };

  const isPositiveChange = change >= 0;
  const changeColor = title === '差评率' || title === '风险门店数' 
    ? (isPositiveChange ? 'text-red-500' : 'text-green-600')
    : (isPositiveChange ? 'text-green-600' : 'text-red-500');

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-l-4 ${borderColors[color]} p-4 cursor-pointer transition-all
        ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}
        ${isDimmed ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>{title}</span>
        <span className={iconColors[color]}>{icon}</span>
      </div>
      <div className={`text-2xl font-bold mb-1 ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-xs ${changeColor}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}{changeLabel} 环比
      </div>
    </div>
  );
}

export function StoreAnalysisPage() {
  const [activeGroup, setActiveGroup] = useState<ViewGroup>('rating');
  const { openStoreDrawer } = useDashboardStore();

  const metrics = useMemo(() => getStoreAnalysisMetrics(), []);
  const aiSummary = useMemo(() => getStoreAnalysisAISummary(), []);
  const ratingDistribution = useMemo(() => getMonthlyStoreRatingDistribution(), []);
  const storeList = useMemo(() => getStoreList(), []);
  const healthBubbleData = useMemo(() => getStoreHealthBubbleData(), []);
  const executionScatterData = useMemo(() => getStoreExecutionScatterData(), []);

  const handleCardClick = (group: ViewGroup) => {
    setActiveGroup(group);
  };

  const handleViewStoreDetails = (storeId: string) => {
    const storeDetail = getStoreDetailById(storeId);
    if (storeDetail) {
      openStoreDrawer(storeDetail);
    }
  };

  const isCardActive = (group: ViewGroup) => activeGroup === group;
  const isCardDimmed = (group: ViewGroup) => activeGroup !== group;

  return (
    <div className="space-y-6">
      <GlobalFilters />
      <AIInsightCard summary={aiSummary} />

      <div className="grid grid-cols-6 gap-4">
        <MetricCard
          title="门店平均评分"
          value={metrics.avgRating.toFixed(2)}
          change={metrics.avgRatingChange}
          changeLabel=""
          icon={<Star className="w-5 h-5" />}
          color="blue"
          isActive={isCardActive('rating')}
          isDimmed={isCardDimmed('rating')}
          onClick={() => handleCardClick('rating')}
        />
        <MetricCard
          title="风险门店数"
          value={metrics.riskStoreCount}
          change={metrics.riskStoreCountChange}
          changeLabel="家"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
          isActive={isCardActive('rating')}
          isDimmed={isCardDimmed('rating')}
          onClick={() => handleCardClick('rating')}
        />
        <MetricCard
          title="优势门店数"
          value={metrics.advantageStoreCount}
          change={metrics.advantageStoreCountChange}
          changeLabel="家"
          icon={<Award className="w-5 h-5" />}
          color="green"
          isActive={isCardActive('rating')}
          isDimmed={isCardDimmed('rating')}
          onClick={() => handleCardClick('rating')}
        />
        <MetricCard
          title="新增评分数量"
          value={metrics.newReviewCount.toLocaleString()}
          change={metrics.newReviewCountChange}
          changeLabel=""
          icon={<MessageSquare className="w-5 h-5" />}
          color="yellow"
          isActive={isCardActive('health')}
          isDimmed={isCardDimmed('health')}
          onClick={() => handleCardClick('health')}
        />
        <MetricCard
          title="差评率"
          value={`${metrics.negativeRate}%`}
          change={metrics.negativeRateChange}
          changeLabel="%"
          icon={<ThumbsDown className="w-5 h-5" />}
          color="orange"
          isActive={isCardActive('health')}
          isDimmed={isCardDimmed('health')}
          onClick={() => handleCardClick('health')}
        />
        <MetricCard
          title="24小时平均回复率"
          value={`${metrics.replyRate24h}%`}
          change={metrics.replyRate24hChange}
          changeLabel="%"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
          isActive={isCardActive('execution')}
          isDimmed={isCardDimmed('execution')}
          onClick={() => handleCardClick('execution')}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activeGroup === 'rating' && '门店评分分布'}
          {activeGroup === 'health' && '门店健康度气泡图'}
          {activeGroup === 'execution' && '执行力散点图'}
        </h2>
        
        {activeGroup === 'rating' && (
          <RatingDistributionStackedChart data={ratingDistribution} />
        )}
        {activeGroup === 'health' && (
          <StoreHealthBubbleChart 
            data={healthBubbleData} 
            onStoreClick={handleViewStoreDetails}
          />
        )}
        {activeGroup === 'execution' && (
          <StoreExecutionScatterChart 
            data={executionScatterData}
            onStoreClick={handleViewStoreDetails}
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">门店列表</h2>
        <StoreGlobalListTable 
          data={storeList}
          onViewDetails={handleViewStoreDetails}
        />
      </div>

      <StoreDetailDrawer />
    </div>
  );
}
