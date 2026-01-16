import { useState } from 'react';
import { Store, TrendingUp, DollarSign, MessageSquare } from 'lucide-react';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { RatingDistributionStackedChart } from '../charts/RatingDistributionStackedChart';
import { RegionalRankingTable } from '../charts/RegionalRankingTable';
import { NegativeAnalysisTrendChart } from '../charts/NegativeAnalysisTrendChart';
import { QSCVTrendChart } from '../charts/QSCVTrendChart';
import { NegativeKeywordCloud } from '../charts/NegativeKeywordCloud';
import { KeywordReviewDrawer } from '../common/KeywordReviewDrawer';
import {
  getRegionalOverviewMetrics,
  getMonthlyRatingDistribution,
  getRegionalAISummary,
} from '../../data/regionalAnalysisData';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'orange' | 'red';
}

function MetricCard({ title, value, change, changeLabel, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'border-l-blue-500 bg-blue-50',
    green: 'border-l-green-500 bg-green-50',
    yellow: 'border-l-yellow-500 bg-yellow-50',
    orange: 'border-l-orange-500 bg-orange-50',
    red: 'border-l-red-500 bg-red-50',
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-l-4 ${colorClasses[color]} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <span className={iconColorClasses[color]}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {change !== undefined && (
        <div className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}{changeLabel !== undefined ? changeLabel : '%'} 环比
        </div>
      )}
    </div>
  );
}

export function RegionalAnalysisPage() {
  const overviewMetrics = getRegionalOverviewMetrics();
  const ratingDistribution = getMonthlyRatingDistribution();
  const aiSummary = getRegionalAISummary();
  
  const [keywordDrawerOpen, setKeywordDrawerOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedKeywordRegion, setSelectedKeywordRegion] = useState('');

  const handleKeywordClick = (keyword: string, region: string) => {
    setSelectedKeyword(keyword);
    setSelectedKeywordRegion(region);
    setKeywordDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <AIInsightCard summary={aiSummary} />

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">整体表现</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="门店数"
            value={overviewMetrics.storeCount}
            change={overviewMetrics.storeCountChange}
            changeLabel="家"
            icon={<Store className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="平均星级"
            value={overviewMetrics.avgRating.toFixed(2)}
            change={overviewMetrics.avgRatingChange}
            changeLabel=""
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            title="总营业收入"
            value={`${overviewMetrics.totalRevenue}万`}
            change={overviewMetrics.totalRevenueChange}
            icon={<DollarSign className="w-5 h-5" />}
            color="yellow"
          />
          <MetricCard
            title="总评价数"
            value={overviewMetrics.totalReviews.toLocaleString()}
            change={overviewMetrics.totalReviewsChange}
            icon={<MessageSquare className="w-5 h-5" />}
            color="orange"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">星级占比门店数（月度变化）</h3>
          <RatingDistributionStackedChart data={ratingDistribution} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">差评分析</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">区域差评趋势</h3>
            <NegativeAnalysisTrendChart />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">QSCV标签趋势</h3>
            <QSCVTrendChart />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">差评关键词分析</h2>
        <NegativeKeywordCloud onKeywordClick={handleKeywordClick} />
      </div>

      <RegionalRankingTable />

      <KeywordReviewDrawer
        isOpen={keywordDrawerOpen}
        onClose={() => setKeywordDrawerOpen(false)}
        keyword={selectedKeyword}
        region={selectedKeywordRegion}
      />
    </div>
  );
}
