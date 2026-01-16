import { useMemo } from 'react';
import { RatingTrendChart } from '../charts/RatingTrendChart';
import { StoreRatingDistributionChart } from '../charts/StoreRatingDistributionChart';
import { MarketTrendChart } from '../charts/MarketTrendChart';
import { TopStoresTable } from '../dashboard/TopStoresTable';
import { useDashboardStore } from '../../store/dashboardStore';
import { getStoreDetail } from '../../utils/dataProcessor';
import {
  getRatingTrendData,
  getStoreDistributionData,
  getMarketTrendData,
  getTopStoresData,
} from '../../data/homePageData';

export function OverviewView() {
  const { filters, openStoreDrawer } = useDashboardStore();
  
  const ratingTrendData = useMemo(() => getRatingTrendData(), []);
  const storeDistributionData = useMemo(() => getStoreDistributionData(), []);
  const marketTrendData = useMemo(() => getMarketTrendData(), []);
  const topStoresData = useMemo(() => getTopStoresData(), []);

  const handleStoreClick = (storeId: string, _storeName: string) => {
    const storeDetail = getStoreDetail(storeId, filters);
    if (storeDetail) {
      openStoreDrawer(storeDetail);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <RatingTrendChart data={ratingTrendData} height={280} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <StoreRatingDistributionChart data={storeDistributionData} height={280} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">区域分析</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketTrendChart 
            markets={marketTrendData.markets} 
            months={marketTrendData.months} 
          />
          <TopStoresTable 
            redList={topStoresData.redList} 
            blackList={topStoresData.blackList}
            onStoreClick={handleStoreClick}
          />
        </div>
      </div>
    </div>
  );
}
