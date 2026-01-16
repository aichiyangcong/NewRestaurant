import { useState, useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { getStoreDetail } from '../../utils/dataProcessor';
import { FoodSafetyTrendChart } from '../charts/FoodSafetyTrendChart';
import { MarketFoodSafetyTrendChart } from '../charts/MarketFoodSafetyTrendChart';
import { RegionalKeywordsChart } from '../charts/RegionalKeywordsChart';
import { BlacklistStoresCard } from '../charts/BlacklistStoresCard';
import { NegativeWordCloud } from '../charts/NegativeWordCloud';
import { ReviewVoiceDrawer } from '../common/ReviewVoiceDrawer';
import {
  getFoodSafetyTrendDaily,
  getFoodSafetyTrendMonthly,
  getFoodSafetyKeywords,
  getMarketFoodSafetyTrendDaily,
  getMarketFoodSafetyTrendWeekly,
  getMarketKeywordsData,
  getBlacklistStores,
  getReviewVoices,
} from '../../data/foodSafetyData';

export function FoodSafetyView() {
  const { filters, openStoreDrawer } = useDashboardStore();
  const [trendGranularity, setTrendGranularity] = useState<'day' | 'month'>('day');
  const [marketGranularity, setMarketGranularity] = useState<'day' | 'week'>('week');
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState('');

  const trendData = useMemo(
    () => (trendGranularity === 'day' ? getFoodSafetyTrendDaily() : getFoodSafetyTrendMonthly()),
    [trendGranularity]
  );

  const marketTrendData = useMemo(
    () => (marketGranularity === 'week' ? getMarketFoodSafetyTrendWeekly() : getMarketFoodSafetyTrendDaily()),
    [marketGranularity]
  );

  const keywordsData = useMemo(() => getFoodSafetyKeywords(), []);
  const marketKeywordsData = useMemo(() => getMarketKeywordsData(), []);
  const blacklistData = useMemo(() => getBlacklistStores(), []);

  const reviewVoices = useMemo(
    () => (selectedKeyword ? getReviewVoices(selectedKeyword) : []),
    [selectedKeyword]
  );

  const wordCloudData = useMemo(
    () => keywordsData.map(k => ({ name: k.keyword, value: k.count })),
    [keywordsData]
  );

  const handleStoreClick = (storeId: string, _storeName: string) => {
    const storeDetail = getStoreDetail(storeId, filters);
    if (storeDetail) {
      openStoreDrawer(storeDetail);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    setReviewDrawerOpen(true);
  };

  const handleWordCloudClick = (word: string) => {
    setSelectedKeyword(word);
    setReviewDrawerOpen(true);
  };

  const handleMarketTrendClick = (market: string, date: string) => {
    console.log('Navigate to reviews:', market, date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <FoodSafetyTrendChart
            data={trendData.data}
            currentCount={trendData.currentCount}
            changeRate={trendData.changeRate}
            granularity={trendGranularity}
            onGranularityChange={setTrendGranularity}
            height={280}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">食品安全关键词 Top 10</h3>
          <p className="text-xs text-gray-400 mb-3">点击关键词可查看顾客原声</p>
          <NegativeWordCloud
            data={wordCloudData}
            mode="negative"
            height={260}
            onWordClick={handleWordCloudClick}
            hideHeader={true}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <MarketFoodSafetyTrendChart
          dates={marketTrendData.dates}
          markets={marketTrendData.markets}
          data={marketTrendData.data}
          granularity={marketGranularity}
          onGranularityChange={setMarketGranularity}
          height={320}
          onDataPointClick={handleMarketTrendClick}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <RegionalKeywordsChart
            data={marketKeywordsData}
            onKeywordClick={handleKeywordClick}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <BlacklistStoresCard
            data={blacklistData}
            onStoreClick={handleStoreClick}
          />
        </div>
      </div>

      <ReviewVoiceDrawer
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        keyword={selectedKeyword}
        reviews={reviewVoices}
      />
    </div>
  );
}
