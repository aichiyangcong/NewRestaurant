import { Star, ThumbsDown, AlertTriangle, MessageCircle } from 'lucide-react';
import { KPICard } from './KPICard';
import type { KPIData } from '../../types';

interface KPICardsProps {
  data: KPIData;
  loading?: boolean;
}

export function KPICards({ data, loading }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KPICard
        title="品牌综合评分"
        value={data.brandScore.toFixed(1)}
        trend={data.brandScoreTrend}
        icon={<Star className="w-5 h-5" />}
        loading={loading}
        color="blue"
      />

      <KPICard
        title="差评率"
        value={`${data.negativeRate.toFixed(1)}%`}
        trend={data.negativeRateTrend}
        icon={<ThumbsDown className="w-5 h-5" />}
        loading={loading}
        color="red"
      />

      <KPICard
        title="平均回复率"
        value={`${data.avgReplyRate.toFixed(1)}%`}
        trend={data.avgReplyRateTrend}
        icon={<MessageCircle className="w-5 h-5" />}
        loading={loading}
        color="green"
      />

      <KPICard
        title="食安风险事件"
        value={data.foodSafetyIncidents}
        trend={data.foodSafetyIncidentsTrend}
        icon={<AlertTriangle className="w-5 h-5" />}
        loading={loading}
        color="orange"
      />
    </div>
  );
}
