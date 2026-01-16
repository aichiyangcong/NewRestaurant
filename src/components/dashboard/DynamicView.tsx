import { useDashboardStore } from '../../store/dashboardStore';
import { BrandScoreView } from '../views/BrandScoreView';
import { NegativeRateView } from '../views/NegativeRateView';
import { FoodSafetyView } from '../views/FoodSafetyView';
import { ReplyRateView } from '../views/ReplyRateView';

export function DynamicView() {
  const { activeView } = useDashboardStore();

  const views = {
    brandScore: <BrandScoreView />,
    negativeRate: <NegativeRateView />,
    foodSafety: <FoodSafetyView />,
    replyRate: <ReplyRateView />,
  };

  return <div className="min-h-[600px]">{views[activeView]}</div>;
}
