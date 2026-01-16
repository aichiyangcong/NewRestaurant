import { useMemo } from 'react';
import { format, eachDayOfInterval } from 'date-fns';
import { useDashboardStore } from '../../store/dashboardStore';
import { getReviews, getStores } from '../../data/mockData';
import { filterReviews, getStoreDetail } from '../../utils/dataProcessor';
import { TrendLineChart } from '../charts/TrendLineChart';
import { DistributionBarChart } from '../charts/DistributionBarChart';
import { StackedBarChart } from '../charts/StackedBarChart';
import { ChartSkeleton, TableSkeleton } from '../common/LoadingSkeleton';
import { CHANNELS, REGIONS } from '../../data/constants';

export function ReplyRateView() {
  const { filters, loading, openStoreDrawer } = useDashboardStore();
  const reviews = useMemo(() => getReviews(), []);
  const stores = useMemo(() => getStores(), []);

  const trendData = useMemo(() => {
    const filteredReviews = filterReviews(reviews, filters);
    const days = eachDayOfInterval({
      start: filters.dateRange.startDate,
      end: filters.dateRange.endDate,
    });

    return days.map((day) => {
      const dayReviews = filteredReviews.filter(
        (r) => format(r.createTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );

      const repliedCount = dayReviews.filter((r) => r.replied).length;
      const replyRate = (repliedCount / (dayReviews.length || 1)) * 100;

      return {
        date: format(day, 'MM-dd'),
        value: Number(replyRate.toFixed(2)),
      };
    });
  }, [reviews, filters]);

  const channelData = useMemo(() => {
    const filteredReviews = filterReviews(reviews, filters);

    return CHANNELS.map((channel) => {
      const channelReviews = filteredReviews.filter((r) => r.channel === channel);
      const repliedCount = channelReviews.filter((r) => r.replied).length;
      const replyRate = (repliedCount / (channelReviews.length || 1)) * 100;

      return {
        name: channel,
        value: Number(replyRate.toFixed(1)),
      };
    });
  }, [reviews, filters]);

  const regionData = useMemo(() => {
    const filteredReviews = filterReviews(reviews, filters);

    return REGIONS.map((region) => {
      const regionStores = stores.filter((s) => s.region === region);
      const regionReviews = filteredReviews.filter((r) =>
        regionStores.some((s) => s.id === r.storeId)
      );

      const repliedCount = regionReviews.filter((r) => r.replied).length;
      const replyRate = (repliedCount / (regionReviews.length || 1)) * 100;

      return {
        name: region,
        value: Number(replyRate.toFixed(1)),
      };
    });
  }, [reviews, filters, stores]);

  const avgReplyTimeData = useMemo(() => {
    const filteredReviews = filterReviews(reviews, filters);
    const repliedReviews = filteredReviews.filter((r) => r.replied && r.replyTime);

    const days = eachDayOfInterval({
      start: filters.dateRange.startDate,
      end: filters.dateRange.endDate,
    });

    const categories = days.map((day) => format(day, 'MM-dd'));

    const series = CHANNELS.map((channel) => {
      const data = days.map((day) => {
        const dayReplies = repliedReviews.filter(
          (r) =>
            format(r.createTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
            r.channel === channel &&
            r.replyTime
        );

        if (dayReplies.length === 0) return 0;

        const avgHours =
          dayReplies.reduce((sum, r) => {
            const hours =
              (r.replyTime!.getTime() - r.createTime.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) / dayReplies.length;

        return Number(avgHours.toFixed(1));
      });

      const colors: Record<string, string> = {
        美团: '#fbbf24',
        饿了么: '#3b82f6',
        大众点评: '#10b981',
      };

      return {
        name: channel,
        data,
        color: colors[channel],
      };
    });

    return { categories, series };
  }, [reviews, filters]);

  const lowReplyStores = useMemo(() => {
    const filteredReviews = filterReviews(reviews, filters);
    const storeMap = new Map<string, { replied: number; total: number }>();

    filteredReviews.forEach((review) => {
      if (!storeMap.has(review.storeId)) {
        storeMap.set(review.storeId, { replied: 0, total: 0 });
      }
      const data = storeMap.get(review.storeId)!;
      data.total++;
      if (review.replied) data.replied++;
    });

    const storeRates = Array.from(storeMap.entries())
      .map(([storeId, data]) => ({
        storeId,
        storeName: filteredReviews.find((r) => r.storeId === storeId)?.storeName || '',
        replyRate: (data.replied / data.total) * 100,
        totalReviews: data.total,
      }))
      .filter((s) => s.totalReviews >= 5)
      .sort((a, b) => a.replyRate - b.replyRate)
      .slice(0, 10);

    return storeRates;
  }, [reviews, filters]);

  const handleStoreClick = (storeId: string) => {
    const detail = getStoreDetail(storeId, filters);
    if (detail) {
      openStoreDrawer(detail);
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <TrendLineChart
            data={trendData}
            title="回复率趋势"
            color="#10b981"
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <DistributionBarChart
            data={channelData}
            title="各渠道回复率"
            color="#3b82f6"
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <DistributionBarChart
            data={regionData}
            title="各区域回复率"
            color="#8b5cf6"
            height={300}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <StackedBarChart
            categories={avgReplyTimeData.categories}
            series={avgReplyTimeData.series}
            title="平均回复时长趋势（小时）"
            height={320}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">回复率最低门店TOP10</h3>
          {lowReplyStores.length > 0 ? (
            <div className="space-y-2">
              {lowReplyStores.map((store, index) => (
                <div
                  key={store.storeId}
                  onClick={() => handleStoreClick(store.storeId)}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{store.storeName}</p>
                      <p className="text-xs text-gray-500">评价数: {store.totalReviews}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600">
                      {store.replyRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TableSkeleton rows={10} />
          )}
        </div>
      </div>
    </div>
  );
}
