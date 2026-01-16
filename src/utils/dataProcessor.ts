import { format, eachDayOfInterval, subDays } from 'date-fns';
import type {
  FilterState,
  Review,
  Store,
  KPIData,
  TrendDataPoint,
  DistributionDataPoint,
  BubbleDataPoint,
  BlacklistStore,
  StoreDetail,
  WordCloudItem,
} from '../types';
import { getStores, getReviews } from '../data/mockData';

export function filterReviews(reviews: Review[], filters: FilterState): Review[] {
  return reviews.filter((review) => {
    const inDateRange =
      review.createTime >= filters.dateRange.startDate &&
      review.createTime <= filters.dateRange.endDate;

    if (!inDateRange) return false;

    const stores = getStores();
    const store = stores.find((s) => s.id === review.storeId);
    if (!store) return false;

    if (filters.region !== 'all' && store.region !== filters.region) return false;
    if (filters.channel !== 'all' && review.channel !== filters.channel) return false;

    return true;
  });
}

export function calculateKPIData(reviews: Review[], filters: FilterState): KPIData {
  const filteredReviews = filterReviews(reviews, filters);
  const previousReviews = filterReviews(
    reviews,
    {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        startDate: subDays(
          filters.dateRange.startDate,
          Math.ceil(
            (filters.dateRange.endDate.getTime() - filters.dateRange.startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        ),
        endDate: filters.dateRange.startDate,
      },
    }
  );

  const avgRating =
    filteredReviews.reduce((sum, r) => sum + r.rating, 0) / (filteredReviews.length || 1);
  const brandScore = (avgRating / 5) * 100;

  const negativeCount = filteredReviews.filter((r) => r.rating < 3).length;
  const negativeRate = (negativeCount / (filteredReviews.length || 1)) * 100;

  const repliedCount = filteredReviews.filter((r) => r.replied).length;
  const avgReplyRate = (repliedCount / (filteredReviews.length || 1)) * 100;

  const foodSafetyIncidents = filteredReviews.filter((r) => r.riskCategory).length;

  const prevAvgRating =
    previousReviews.reduce((sum, r) => sum + r.rating, 0) / (previousReviews.length || 1);
  const prevBrandScore = (prevAvgRating / 5) * 100;
  const brandScoreTrend = prevBrandScore
    ? Number((((brandScore - prevBrandScore) / prevBrandScore) * 100).toFixed(1))
    : 0;

  const prevNegativeRate =
    (previousReviews.filter((r) => r.rating < 3).length / (previousReviews.length || 1)) * 100;
  const negativeRateTrend = prevNegativeRate
    ? Number((((negativeRate - prevNegativeRate) / prevNegativeRate) * 100).toFixed(1))
    : 0;

  const prevReplyRate =
    (previousReviews.filter((r) => r.replied).length / (previousReviews.length || 1)) * 100;
  const avgReplyRateTrend = prevReplyRate
    ? Number((((avgReplyRate - prevReplyRate) / prevReplyRate) * 100).toFixed(1))
    : 0;

  const prevFoodSafetyIncidents = previousReviews.filter((r) => r.riskCategory).length;
  const foodSafetyIncidentsTrend = prevFoodSafetyIncidents
    ? Number(
        (
          ((foodSafetyIncidents - prevFoodSafetyIncidents) / prevFoodSafetyIncidents) *
          100
        ).toFixed(1)
      )
    : 0;

  return {
    brandScore,
    brandScoreTrend,
    negativeRate,
    negativeRateTrend,
    avgReplyRate,
    avgReplyRateTrend,
    foodSafetyIncidents,
    foodSafetyIncidentsTrend,
  };
}

export function calculateTrendData(reviews: Review[], filters: FilterState): TrendDataPoint[] {
  const filteredReviews = filterReviews(reviews, filters);
  const days = eachDayOfInterval({
    start: filters.dateRange.startDate,
    end: filters.dateRange.endDate,
  });

  return days.map((day) => {
    const dayReviews = filteredReviews.filter(
      (r) => format(r.createTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    const avgRating =
      dayReviews.reduce((sum, r) => sum + r.rating, 0) / (dayReviews.length || 1);

    return {
      date: format(day, 'MM-dd'),
      value: Number(avgRating.toFixed(2)),
    };
  });
}

export function calculateDistributionData(
  reviews: Review[],
  filters: FilterState
): DistributionDataPoint[] {
  const filteredReviews = filterReviews(reviews, filters);
  const ratingGroups = [
    { name: '5星', min: 4.5, max: 5 },
    { name: '4-5星', min: 4, max: 4.5 },
    { name: '3-4星', min: 3, max: 4 },
    { name: '2-3星', min: 2, max: 3 },
    { name: '1-2星', min: 1, max: 2 },
  ];

  return ratingGroups.map((group) => {
    const count = filteredReviews.filter((r) => r.rating >= group.min && r.rating < group.max).length;
    return {
      name: group.name,
      value: count,
      percentage: Number(((count / (filteredReviews.length || 1)) * 100).toFixed(1)),
    };
  });
}

export function calculateBubbleData(
  reviews: Review[],
  filters: FilterState
): BubbleDataPoint[] {
  const filteredReviews = filterReviews(reviews, filters);
  const riskReviews = filteredReviews.filter((r) => r.riskCategory);

  const categoryMap = new Map<string, { stores: Set<string>; complaints: number }>();

  riskReviews.forEach((review) => {
    if (!review.riskCategory) return;

    if (!categoryMap.has(review.riskCategory)) {
      categoryMap.set(review.riskCategory, { stores: new Set(), complaints: 0 });
    }

    const data = categoryMap.get(review.riskCategory)!;
    data.stores.add(review.storeId);
    data.complaints++;
  });

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    storeName: category,
    storeCount: data.stores.size,
    complaintCount: data.complaints,
    bubbleSize: data.complaints,
    category: category as any,
  }));
}

export function calculateBlacklistStores(
  reviews: Review[],
  filters: FilterState
): BlacklistStore[] {
  const filteredReviews = filterReviews(reviews, filters);
  const storeMap = new Map<string, Review[]>();

  filteredReviews.forEach((review) => {
    if (!storeMap.has(review.storeId)) {
      storeMap.set(review.storeId, []);
    }
    storeMap.get(review.storeId)!.push(review);
  });

  const blacklist: BlacklistStore[] = [];

  storeMap.forEach((storeReviews, storeId) => {
    const avgRating =
      storeReviews.reduce((sum, r) => sum + r.rating, 0) / (storeReviews.length || 1);
    const negativeCount = storeReviews.filter((r) => r.rating < 3).length;
    const negativeRate = (negativeCount / storeReviews.length) * 100;

    const issues = new Map<string, number>();
    storeReviews.forEach((r) => {
      r.tags.forEach((tag) => {
        issues.set(tag, (issues.get(tag) || 0) + 1);
      });
    });

    const mainIssues = Array.from(issues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((e) => e[0]);

    if (negativeRate > 15 || avgRating < 3.5) {
      blacklist.push({
        storeId,
        storeName: storeReviews[0].storeName,
        score: Number(avgRating.toFixed(1)),
        negativeRate: Number(negativeRate.toFixed(1)),
        complaintsCount: negativeCount,
        mainIssues,
      });
    }
  });

  return blacklist.sort((a, b) => b.negativeRate - a.negativeRate).slice(0, 10);
}

export function calculateWordCloudData(
  reviews: Review[],
  filters: FilterState
): WordCloudItem[] {
  const filteredReviews = filterReviews(reviews, filters);
  const negativeReviews = filteredReviews.filter((r) => r.rating < 3);

  const wordMap = new Map<string, number>();

  negativeReviews.forEach((review) => {
    review.tags.forEach((tag) => {
      wordMap.set(tag, (wordMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(wordMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50);
}

export function getStoreDetail(storeId: string, filters: FilterState): StoreDetail | null {
  const stores = getStores();
  const store = stores.find((s) => s.id === storeId);
  if (!store) return null;

  const allReviews = getReviews();
  const storeReviews = allReviews.filter((r) => r.storeId === storeId);

  const filteredReviews = filterReviews(storeReviews, filters);

  const avgRating =
    filteredReviews.reduce((sum, r) => sum + r.rating, 0) / (filteredReviews.length || 1);
  const negativeCount = filteredReviews.filter((r) => r.rating < 3).length;
  const negativeRate = (negativeCount / (filteredReviews.length || 1)) * 100;
  const repliedCount = filteredReviews.filter((r) => r.replied).length;
  const replyRate = (repliedCount / (filteredReviews.length || 1)) * 100;

  const issueMap = new Map<string, number>();
  filteredReviews.forEach((r) => {
    r.tags.forEach((tag) => {
      issueMap.set(tag, (issueMap.get(tag) || 0) + 1);
    });
  });

  const issueDistribution = Array.from(issueMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const positiveReviews = filteredReviews.filter((r) => r.rating >= 4.5);
  const negativeReviews = filteredReviews.filter((r) => r.rating < 3);

  const positiveTagMap = new Map<string, number>();
  positiveReviews.forEach((r) => {
    r.tags.forEach((tag) => {
      if (tag !== '一般' && tag !== '中规中矩') {
        positiveTagMap.set(tag, (positiveTagMap.get(tag) || 0) + 1);
      }
    });
  });

  const negativeTagMap = new Map<string, number>();
  negativeReviews.forEach((r) => {
    r.tags.forEach((tag) => {
      if (tag !== '一般' && tag !== '中规中矩') {
        negativeTagMap.set(tag, (negativeTagMap.get(tag) || 0) + 1);
      }
    });
  });

  const positiveTagsTop3 = Array.from(positiveTagMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const negativeTagsTop3 = Array.from(negativeTagMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const commercialAreas = ['徐家汇', '陆家嘴', '南京西路', '五角场', '中山公园'];
  const categories = ['川菜', '火锅', '烧烤', '小吃快餐', '日料'];

  const commercialAreaRanking = {
    area: commercialAreas[Math.floor(Math.random() * commercialAreas.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    rank: Math.floor(Math.random() * 20) + 1,
  };

  return {
    ...store,
    totalReviews: filteredReviews.length,
    avgRating: Number(avgRating.toFixed(1)),
    negativeReviews: negativeCount,
    negativeRate: Number(negativeRate.toFixed(1)),
    replyRate: Number(replyRate.toFixed(1)),
    recentReviews: filteredReviews.slice(0, 10),
    issueDistribution,
    commercialAreaRanking,
    positiveTagsTop3,
    negativeTagsTop3,
  };
}
