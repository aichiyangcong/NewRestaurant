import { useState, useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { getStoreDetail } from '../../utils/dataProcessor';
import { ReviewTrendBarChart } from '../charts/ReviewTrendBarChart';
import { MarketDistributionChart } from '../charts/MarketDistributionChart';
import { MarketPositiveTrendChart } from '../charts/MarketPositiveTrendChart';
import { MarketNegativeTrendChart2 } from '../charts/MarketNegativeTrendChart2';
import { DimensionAnalysisChart } from '../charts/DimensionAnalysisChart';
import { NegativeWordCloud } from '../charts/NegativeWordCloud';
import {
  getMarketDistributionData,
  getDimensionData,
  getNegativeWordCloud,
} from '../../data/negativeRateData';

export function NegativeRateView() {
  const { filters, openStoreDrawer } = useDashboardStore();
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  const marketDistributionData = useMemo(() => getMarketDistributionData(), []);
  const dimensionData = useMemo(() => getDimensionData(), []);
  const wordCloudData = useMemo(() => getNegativeWordCloud(), []);

  const handleStoreClick = (storeId: string, _storeName: string) => {
    const storeDetail = getStoreDetail(storeId, filters);
    if (storeDetail) {
      openStoreDrawer(storeDetail);
    }
  };

  const handleMarketClick = (market: string) => {
    setSelectedMarket(market === selectedMarket ? null : market);
  };

  const handleWordClick = (word: string) => {
    console.log('Navigate to review management with keyword:', word);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ReviewTrendBarChart height={280} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <MarketDistributionChart
            data={marketDistributionData}
            height={280}
            onMarketClick={handleMarketClick}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <MarketPositiveTrendChart height={280} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <MarketNegativeTrendChart2 height={280} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">差评归因</h2>
        <p className="text-sm text-gray-500 mb-4">点击可查看用户原声</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DimensionAnalysisChart
            data={dimensionData}
            height={320}
            onStoreClick={handleStoreClick}
          />
          <NegativeWordCloud
            data={wordCloudData}
            mode="negative"
            height={280}
            onWordClick={handleWordClick}
          />
        </div>
      </div>
    </div>
  );
}
