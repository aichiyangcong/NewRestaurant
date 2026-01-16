import { useMemo } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { getReviews } from '../../data/mockData';
import {
  calculateTrendData,
  calculateDistributionData,
  calculateBlacklistStores,
  calculateWordCloudData,
  getStoreDetail,
} from '../../utils/dataProcessor';
import { TrendLineChart } from '../charts/TrendLineChart';
import { DistributionBarChart } from '../charts/DistributionBarChart';
import { WordCloud } from '../charts/WordCloud';
import { ChartSkeleton, TableSkeleton } from '../common/LoadingSkeleton';

export function BrandScoreView() {
  const { filters, loading, openStoreDrawer, openReviewDrawer } = useDashboardStore();
  const reviews = useMemo(() => getReviews(), []);

  const trendData = useMemo(() => calculateTrendData(reviews, filters), [reviews, filters]);
  const distributionData = useMemo(
    () => calculateDistributionData(reviews, filters),
    [reviews, filters]
  );
  const blacklistStores = useMemo(
    () => calculateBlacklistStores(reviews, filters),
    [reviews, filters]
  );
  const wordCloudData = useMemo(
    () => calculateWordCloudData(reviews, filters),
    [reviews, filters]
  );

  const handleStoreClick = (storeId: string) => {
    const detail = getStoreDetail(storeId, filters);
    if (detail) {
      openStoreDrawer(detail);
    }
  };

  const handleWordClick = (word: string) => {
    const negativeReviews = reviews
      .filter((r) => r.rating < 3 && r.tags.includes(word))
      .slice(0, 10)
      .map((r) => r.content);
    openReviewDrawer(negativeReviews);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ChartSkeleton />
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <TrendLineChart
            data={trendData}
            title="综合评分趋势"
            color="#3b82f6"
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <DistributionBarChart
            data={distributionData}
            title="评分分布"
            color="#10b981"
            height={300}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">黑榜门店TOP10</h3>
          {blacklistStores.length > 0 ? (
            <div className="space-y-3">
              {blacklistStores.map((store, index) => (
                <div
                  key={store.storeId}
                  onClick={() => handleStoreClick(store.storeId)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{store.storeName}</p>
                      <div className="flex gap-2 mt-1">
                        {store.mainIssues.slice(0, 3).map((issue) => (
                          <span
                            key={issue}
                            className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{store.score}分</p>
                    <p className="text-xs text-red-600">{store.negativeRate}%差评</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TableSkeleton rows={10} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <WordCloud
            data={wordCloudData}
            title="差评关键词"
            height={350}
            onWordClick={handleWordClick}
          />
        </div>
      </div>
    </div>
  );
}
