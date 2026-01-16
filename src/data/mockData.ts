import { subDays, subMonths, format, isAfter, isBefore } from 'date-fns';
import type { Store, Review, Region, Province, Channel, RiskCategory, StoreMetrics, StoreAnalysisKPI, ContentAnalysisData, QSCVTagL1, QSCVTagL2, QSCVTagL3, WordCloudItem } from '../types';
import {
  REGIONS,
  CITIES_BY_REGION,
  CHANNELS,
  RISK_CATEGORIES,
  STORE_NAMES,
  REVIEW_KEYWORDS_POSITIVE,
  REVIEW_KEYWORDS_NEGATIVE,
  REVIEW_TEMPLATES,
} from './constants';

const PROVINCES_MAP: Record<string, Province> = {
  '上海市': '上海',
  '杭州市': '浙江',
  '南京市': '江苏',
  '苏州市': '江苏',
  '北京市': '北京',
  '天津市': '河北',
  '石家庄市': '河北',
  '广州市': '广东',
  '深圳市': '广东',
  '福州市': '福建',
  '厦门市': '福建',
};

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateStoreId(index: number): string {
  return `STORE${String(index).padStart(4, '0')}`;
}

function generateReviewId(index: number): string {
  return `REV${String(index).padStart(8, '0')}`;
}

export function generateStores(): Store[] {
  const stores: Store[] = [];
  let storeIndex = 0;

  for (const region of REGIONS) {
    const cities = CITIES_BY_REGION[region];
    const storesPerCity = Math.floor(300 / 11);

    for (const city of cities) {
      const province = PROVINCES_MAP[city];
      const count = city === '上海市' || city === '北京市' ? storesPerCity + 20 : storesPerCity;

      for (let i = 0; i < count && storeIndex < 300; i++) {
        const storeName = randomItem(STORE_NAMES);
        const address = `${city}${randomItem(['中心', '东', '西', '南', '北'])}路${randomInt(1, 999)}号`;
        const openDate = subMonths(new Date(), randomInt(1, 60));

        stores.push({
          id: generateStoreId(storeIndex + 1),
          name: `${storeName}(${city.replace('市', '')}${randomInt(1, 50)}店)`,
          region,
          province,
          address,
          openDate,
        });

        storeIndex++;
      }
    }
  }

  return stores.slice(0, 300);
}

export function generateReviews(stores: Store[], days: number = 30): Review[] {
  const reviews: Review[] = [];
  const reviewsPerDay = 1000;
  let reviewIndex = 0;

  for (let day = 0; day < days; day++) {
    const date = subDays(new Date(), day);

    for (let i = 0; i < reviewsPerDay; i++) {
      const store = randomItem(stores);
      const channel = randomItem(CHANNELS);

      const ratingRand = Math.random();
      let rating: number;
      let isNegative: boolean;

      if (ratingRand < 0.7) {
        rating = randomFloat(4.5, 5.0, 1);
        isNegative = false;
      } else if (ratingRand < 0.9) {
        rating = randomFloat(3.0, 4.4, 1);
        isNegative = false;
      } else {
        rating = randomFloat(1.0, 2.9, 1);
        isNegative = true;
      }

      const replied = Math.random() < 0.65;
      const replyDelay = randomInt(1, 48);

      let content: string;
      let tags: string[];
      let riskCategory: RiskCategory | undefined;

      if (rating >= 4.5) {
        content = randomItem(REVIEW_TEMPLATES.positive);
        tags = [randomItem(REVIEW_KEYWORDS_POSITIVE), randomItem(REVIEW_KEYWORDS_POSITIVE)];
      } else if (rating >= 3.0) {
        content = randomItem(REVIEW_TEMPLATES.neutral);
        tags = ['一般', '中规中矩'];
      } else {
        content = randomItem(REVIEW_TEMPLATES.negative);
        riskCategory = randomItem(RISK_CATEGORIES);
        tags = [riskCategory, randomItem(REVIEW_KEYWORDS_NEGATIVE)];
      }

      const createTime = new Date(date);
      createTime.setHours(randomInt(10, 22), randomInt(0, 59), randomInt(0, 59));

      const review: Review = {
        id: generateReviewId(reviewIndex + 1),
        storeId: store.id,
        storeName: store.name,
        rating,
        content,
        channel,
        createTime,
        replied,
        tags,
        riskCategory: isNegative ? riskCategory : undefined,
      };

      if (replied) {
        const replyTime = new Date(createTime);
        replyTime.setHours(replyTime.getHours() + replyDelay);
        review.replyTime = replyTime;
        review.replyContent = '感谢您的反馈，我们会持续改进服务质量，期待您的再次光临！';
      }

      reviews.push(review);
      reviewIndex++;
    }
  }

  return reviews;
}

let cachedStores: Store[] | null = null;
let cachedReviews: Review[] | null = null;

export function getStores(): Store[] {
  if (!cachedStores) {
    cachedStores = generateStores();
  }
  return cachedStores;
}

export function getReviews(): Review[] {
  if (!cachedReviews) {
    const stores = getStores();
    cachedReviews = generateReviews(stores, 30);
  }
  return cachedReviews;
}

export function resetMockData(): void {
  cachedStores = null;
  cachedReviews = null;
}

export function calculateStoreMetrics(stores: Store[], reviews: Review[]): StoreMetrics[] {
  const now = new Date();
  const last7Days = subDays(now, 7);
  const last14Days = subDays(now, 14);
  const prev7Days = subDays(now, 14);

  return stores.map(store => {
    const storeReviews = reviews.filter(r => r.storeId === store.id);
    const recentReviews = storeReviews.filter(r => isAfter(r.createTime, last7Days));
    const previousReviews = storeReviews.filter(r =>
      isAfter(r.createTime, last14Days) && isBefore(r.createTime, last7Days)
    );

    const avgRating = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
      : 4.5;

    const prevAvgRating = previousReviews.length > 0
      ? previousReviews.reduce((sum, r) => sum + r.rating, 0) / previousReviews.length
      : avgRating;

    const negativeCount = recentReviews.filter(r => r.rating < 3.0).length;
    const negativeRate = recentReviews.length > 0 ? (negativeCount / recentReviews.length) * 100 : 0;

    const prevNegativeCount = previousReviews.filter(r => r.rating < 3.0).length;
    const prevNegativeRate = previousReviews.length > 0 ? (prevNegativeCount / previousReviews.length) * 100 : negativeRate;

    const replyCount = recentReviews.filter(r => r.replied).length;
    const replyRate = recentReviews.length > 0 ? (replyCount / recentReviews.length) * 100 : 0;

    const prevReplyCount = previousReviews.filter(r => r.replied).length;
    const prevReplyRate = previousReviews.length > 0 ? (prevReplyCount / previousReviews.length) * 100 : replyRate;

    let riskLevel: 'risk' | 'normal' | 'advantage' = 'normal';
    if (avgRating < 4.0 || negativeRate > 15) {
      riskLevel = 'risk';
    } else if (avgRating >= 4.7 && negativeRate < 5) {
      riskLevel = 'advantage';
    }

    return {
      storeId: store.id,
      storeName: store.name,
      avgRating: Number(avgRating.toFixed(1)),
      avgRatingChange: Number((avgRating - prevAvgRating).toFixed(2)),
      totalReviews: recentReviews.length,
      totalReviewsChange: recentReviews.length - previousReviews.length,
      negativeRate: Number(negativeRate.toFixed(1)),
      negativeRateChange: Number((negativeRate - prevNegativeRate).toFixed(1)),
      replyRate: Number(replyRate.toFixed(1)),
      replyRateChange: Number((replyRate - prevReplyRate).toFixed(1)),
      newReviewsCount: recentReviews.length,
      riskLevel,
    };
  });
}

export function calculateStoreAnalysisKPI(storeMetrics: StoreMetrics[]): StoreAnalysisKPI {
  const totalStores = storeMetrics.length;
  const avgRating = storeMetrics.reduce((sum, s) => sum + s.avgRating, 0) / totalStores;
  const avgRatingChange = storeMetrics.reduce((sum, s) => sum + s.avgRatingChange, 0) / totalStores;

  const riskStores = storeMetrics.filter(s => s.riskLevel === 'risk');
  const advantageStores = storeMetrics.filter(s => s.riskLevel === 'advantage');

  const totalNewReviews = storeMetrics.reduce((sum, s) => sum + s.newReviewsCount, 0);
  const totalNewReviewsChange = storeMetrics.reduce((sum, s) => sum + s.totalReviewsChange, 0);

  const avgNegativeRate = storeMetrics.reduce((sum, s) => sum + s.negativeRate, 0) / totalStores;
  const avgNegativeRateChange = storeMetrics.reduce((sum, s) => sum + s.negativeRateChange, 0) / totalStores;

  const avgReplyRate = storeMetrics.reduce((sum, s) => sum + s.replyRate, 0) / totalStores;
  const avgReplyRateChange = storeMetrics.reduce((sum, s) => sum + s.replyRateChange, 0) / totalStores;

  return {
    avgRating: Number(avgRating.toFixed(1)),
    avgRatingChange: Number(avgRatingChange.toFixed(2)),
    riskStoreCount: riskStores.length,
    riskStoreCountChange: Math.floor(riskStores.length * 0.15) - Math.floor(Math.random() * 5),
    advantageStoreCount: advantageStores.length,
    advantageStoreCountChange: Math.floor(Math.random() * 5) - 2,
    totalNewReviews,
    totalNewReviewsChange,
    avgNegativeRate: Number(avgNegativeRate.toFixed(1)),
    avgNegativeRateChange: Number(avgNegativeRateChange.toFixed(1)),
    avgReplyRate: Number(avgReplyRate.toFixed(1)),
    avgReplyRateChange: Number(avgReplyRateChange.toFixed(1)),
  };
}

export function generateContentAnalysisData(stores: Store[], reviews: Review[]): ContentAnalysisData {
  const positiveReviews = reviews.filter(r => r.rating >= 4.5);
  const neutralReviews = reviews.filter(r => r.rating >= 3.0 && r.rating < 4.5);
  const negativeReviews = reviews.filter(r => r.rating < 3.0);

  const totalReviews = reviews.length;
  const positivePercent = (positiveReviews.length / totalReviews) * 100;
  const neutralPercent = (neutralReviews.length / totalReviews) * 100;
  const negativePercent = (negativeReviews.length / totalReviews) * 100;

  const sentimentScore = Math.round(
    (positivePercent * 1.0 + neutralPercent * 0.6 + negativePercent * 0.2)
  );

  const qscvL1Data: QSCVTagL1[] = [
    {
      name: '口味',
      count: 450,
      children: [
        {
          name: '味道',
          count: 280,
          children: [
            {
              name: '太咸',
              count: 120,
              topStores: generateTopStores(stores, 120),
            },
            {
              name: '太淡',
              count: 85,
              topStores: generateTopStores(stores, 85),
            },
            {
              name: '不新鲜',
              count: 75,
              topStores: generateTopStores(stores, 75),
            },
          ],
        },
        {
          name: '菜品质量',
          count: 170,
          children: [
            {
              name: '分量不足',
              count: 90,
              topStores: generateTopStores(stores, 90),
            },
            {
              name: '卖相差',
              count: 80,
              topStores: generateTopStores(stores, 80),
            },
          ],
        },
      ],
    },
    {
      name: '服务',
      count: 320,
      children: [
        {
          name: '服务态度',
          count: 180,
          children: [
            {
              name: '服务员玩手机',
              count: 120,
              topStores: generateTopStores(stores, 120),
            },
            {
              name: '叫不应',
              count: 60,
              topStores: generateTopStores(stores, 60),
            },
          ],
        },
        {
          name: '上菜速度',
          count: 140,
          children: [
            {
              name: '等待时间过长',
              count: 95,
              topStores: generateTopStores(stores, 95),
            },
            {
              name: '上菜顺序混乱',
              count: 45,
              topStores: generateTopStores(stores, 45),
            },
          ],
        },
      ],
    },
    {
      name: '环境',
      count: 180,
      children: [
        {
          name: '卫生状况',
          count: 110,
          children: [
            {
              name: '桌面脏',
              count: 65,
              topStores: generateTopStores(stores, 65),
            },
            {
              name: '地面油腻',
              count: 45,
              topStores: generateTopStores(stores, 45),
            },
          ],
        },
        {
          name: '就餐环境',
          count: 70,
          children: [
            {
              name: '太吵',
              count: 40,
              topStores: generateTopStores(stores, 40),
            },
            {
              name: '空调温度不适',
              count: 30,
              topStores: generateTopStores(stores, 30),
            },
          ],
        },
      ],
    },
    {
      name: '性价比',
      count: 150,
      children: [
        {
          name: '价格',
          count: 100,
          children: [
            {
              name: '价格虚高',
              count: 70,
              topStores: generateTopStores(stores, 70),
            },
            {
              name: '团购不实惠',
              count: 30,
              topStores: generateTopStores(stores, 30),
            },
          ],
        },
        {
          name: '优惠活动',
          count: 50,
          children: [
            {
              name: '活动规则复杂',
              count: 30,
              topStores: generateTopStores(stores, 30),
            },
            {
              name: '优惠力度小',
              count: 20,
              topStores: generateTopStores(stores, 20),
            },
          ],
        },
      ],
    },
  ];

  const positiveWordCloudData: WordCloudItem[] = [
    { name: '好吃', value: 850 },
    { name: '新鲜', value: 720 },
    { name: '美味', value: 680 },
    { name: '热情', value: 620 },
    { name: '干净', value: 580 },
    { name: '实惠', value: 520 },
    { name: '快速', value: 480 },
    { name: '推荐', value: 450 },
    { name: '满意', value: 420 },
    { name: '周到', value: 380 },
    { name: '不错', value: 350 },
    { name: '优秀', value: 320 },
    { name: '赞', value: 300 },
    { name: '棒', value: 280 },
    { name: '服务好', value: 260 },
    { name: '环境好', value: 240 },
  ];

  const negativeWordCloudData: WordCloudItem[] = [
    { name: '慢', value: 320 },
    { name: '贵', value: 280 },
    { name: '态度差', value: 250 },
    { name: '脏', value: 220 },
    { name: '难吃', value: 200 },
    { name: '不新鲜', value: 180 },
    { name: '等太久', value: 160 },
    { name: '失望', value: 140 },
    { name: '不卫生', value: 120 },
    { name: '服务差', value: 110 },
    { name: '变质', value: 95 },
    { name: '异物', value: 85 },
    { name: '拉肚子', value: 75 },
    { name: '坑', value: 65 },
    { name: '差评', value: 55 },
  ];

  return {
    sentiment: {
      score: sentimentScore,
      positive: Math.round(positivePercent),
      neutral: Math.round(neutralPercent),
      negative: Math.round(negativePercent),
      aiSummary: '本周顾客普遍对"新品促销活动"持积极态度，但在"周末等位"和"服务响应"上存在明显负面情绪，主要集中在华东大区。建议加强周末时段的人员配置，优化服务流程响应速度。',
    },
    qscvTags: qscvL1Data,
    positiveWordCloud: positiveWordCloudData,
    negativeWordCloud: negativeWordCloudData,
  };
}

function generateTopStores(stores: Store[], totalCount: number): Array<{ storeId: string; storeName: string; count: number }> {
  const selectedStores = [];
  const shuffled = [...stores].sort(() => Math.random() - 0.5);

  const numStores = Math.min(5, stores.length);
  let remainingCount = totalCount;

  for (let i = 0; i < numStores; i++) {
    const store = shuffled[i];
    const isLast = i === numStores - 1;
    const count = isLast
      ? remainingCount
      : Math.floor(remainingCount * (0.3 + Math.random() * 0.3));

    selectedStores.push({
      storeId: store.id,
      storeName: store.name,
      count,
    });

    remainingCount -= count;
  }

  return selectedStores.sort((a, b) => b.count - a.count);
}
