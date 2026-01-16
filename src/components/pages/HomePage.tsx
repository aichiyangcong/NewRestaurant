import { useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { MetricCard } from '../dashboard/MetricCard';
import { OverviewView } from '../views/OverviewView';
import { NegativeRateView } from '../views/NegativeRateView';
import { FoodSafetyView } from '../views/FoodSafetyView';
import { ReplyRateView } from '../views/ReplyRateView';
import { getHomeKPIData, getAIInsight } from '../../data/homePageData';
import type { HomeSubViewType } from '../../types';

export function HomePage() {
  const { activeHomeSubView, setActiveHomeSubView } = useDashboardStore();
  
  const kpiData = useMemo(() => getHomeKPIData(), []);
  const aiInsight = useMemo(() => getAIInsight(), []);

  const handleMetricClick = (view: HomeSubViewType) => {
    setActiveHomeSubView(view);
  };

  const shouldDim = (cardView: HomeSubViewType | HomeSubViewType[]) => {
    const views = Array.isArray(cardView) ? cardView : [cardView];
    return !views.includes(activeHomeSubView);
  };

  const subViews: Record<HomeSubViewType, React.ReactNode> = {
    brandScore: <OverviewView />,
    negativeRate: <NegativeRateView />,
    foodSafety: <FoodSafetyView />,
    replyRate: <ReplyRateView />,
  };

  return (
    <div className="space-y-6">
      <AIInsightCard summary={aiInsight} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard
          title="综合评分"
          value={kpiData.brandScore.toFixed(1)}
          trend={kpiData.brandScoreTrend}
          trendLabel=" 环比上升"
          color="blue"
          isActive={activeHomeSubView === 'brandScore'}
          isDimmed={shouldDim('brandScore')}
          onClick={() => handleMetricClick('brandScore')}
        />

        <MetricCard
          title="评价数量"
          value={`${kpiData.reviewCount}条`}
          subValue={`${kpiData.positiveCount}条好评+${kpiData.neutralCount}条中评+${kpiData.negativeCount}条差评`}
          color="blue"
          isActive={activeHomeSubView === 'brandScore'}
          isDimmed={shouldDim('brandScore')}
          onClick={() => handleMetricClick('brandScore')}
          showInfo
        />

        <MetricCard
          title="万元差评次数"
          value={`${kpiData.negativePerTenThousand}次`}
          trend={kpiData.negativePerTenThousandTrend}
          trendLabel=" 环比"
          color="yellow"
          isActive={activeHomeSubView === 'negativeRate'}
          isDimmed={shouldDim('negativeRate')}
          onClick={() => handleMetricClick('negativeRate')}
        />

        <MetricCard
          title="差评率"
          value={`${kpiData.negativeRate}%`}
          trend={kpiData.negativeRateTrend}
          trendLabel="% 环比上升"
          color="yellow"
          isActive={activeHomeSubView === 'negativeRate'}
          isDimmed={shouldDim('negativeRate')}
          onClick={() => handleMetricClick('negativeRate')}
          showInfo
        />

        <MetricCard
          title="食安风险"
          value={kpiData.foodSafetyRisks}
          subValue={`${kpiData.foodSafetyPending}%环比下降`}
          color="orange"
          isActive={activeHomeSubView === 'foodSafety'}
          isDimmed={shouldDim('foodSafety')}
          onClick={() => handleMetricClick('foodSafety')}
          showInfo
        />

        <MetricCard
          title="回复率"
          value={`${kpiData.replyRate}%`}
          subValue={`领先行业${kpiData.replyRateVsIndustry}%`}
          color="green"
          isActive={activeHomeSubView === 'replyRate'}
          isDimmed={shouldDim('replyRate')}
          onClick={() => handleMetricClick('replyRate')}
        />
      </div>

      <div className="min-h-[600px]">
        {subViews[activeHomeSubView]}
      </div>
    </div>
  );
}
