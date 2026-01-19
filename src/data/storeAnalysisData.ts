import { REGIONS } from './constants';
import type { StoreDetail } from '../types';

export interface StoreAnalysisMetrics {
  avgRating: number;
  avgRatingChange: number;
  riskStoreCount: number;
  riskStoreCountChange: number;
  advantageStoreCount: number;
  advantageStoreCountChange: number;
  newReviewCount: number;
  newReviewCountChange: number;
  negativeRate: number;
  negativeRateChange: number;
  replyRate24h: number;
  replyRate24hChange: number;
}

export interface StoreListItem {
  id: string;
  region: string;
  storeName: string;
  supervisor: string;
  rating: number;
  negativeCount: number;
  replyRate24h: number;
}

export interface MonthlyStoreRatingDistribution {
  month: string;
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
}

export interface StoreHealthBubbleData {
  id: string;
  storeName: string;
  region: string;
  avgRating: number;
  negativeRate: number;
  reviewCount: number;
  riskLevel: 'risk' | 'normal' | 'advantage';
}

export interface StoreExecutionScatterData {
  id: string;
  storeName: string;
  region: string;
  avgRating: number;
  replyRate24h: number;
  riskLevel: 'risk' | 'normal' | 'advantage';
}

export function getStoreAnalysisMetrics(): StoreAnalysisMetrics {
  return {
    avgRating: 4.32,
    avgRatingChange: 0.05,
    riskStoreCount: 28,
    riskStoreCountChange: -3,
    advantageStoreCount: 156,
    advantageStoreCountChange: 12,
    newReviewCount: 8542,
    newReviewCountChange: 523,
    negativeRate: 3.2,
    negativeRateChange: -0.4,
    replyRate24h: 87.5,
    replyRate24hChange: 2.3,
  };
}

export function getStoreAnalysisAISummary(): string {
  return '本周门店整体表现良好，平均评分4.32分，环比上升0.05分。风险门店减少3家至28家，需重点关注华东区域的3家新增风险门店。优势门店新增12家，其中华南区域表现突出。24小时回复率提升2.3%，建议继续加强夜间时段的回复效率。';
}

export function getMonthlyStoreRatingDistribution(): MonthlyStoreRatingDistribution[] {
  return [
    { month: '2025-07', star5: 85, star4: 120, star3: 45, star2: 20, star1: 8 },
    { month: '2025-08', star5: 92, star4: 115, star3: 48, star2: 18, star1: 7 },
    { month: '2025-09', star5: 98, star4: 118, star3: 42, star2: 16, star1: 6 },
    { month: '2025-10', star5: 105, star4: 122, star3: 38, star2: 14, star1: 5 },
    { month: '2025-11', star5: 112, star4: 125, star3: 35, star2: 12, star1: 4 },
    { month: '2025-12', star5: 118, star4: 128, star3: 32, star2: 10, star1: 4 },
  ];
}

const storeNames = [
  '东方广场店', '万达中心店', '银泰百货店', '新天地店', '太古里店',
  '来福士店', '恒隆广场店', '万象城店', '大悦城店', '龙湖天街店',
  '印象城店', '吾悦广场店', '爱琴海店', '世茂广场店', '中粮大悦城店',
  '凯德广场店', '华润万象汇店', '新城吾悦店', '龙湖时代天街店', '金鹰购物中心店',
];

const supervisors = [
  '张三', '李四', '王五', '赵六', '陈七',
  '刘八', '周九', '吴十', '郑一', '孙二',
];

export function getStoreList(): StoreListItem[] {
  const stores: StoreListItem[] = [];
  
  REGIONS.forEach((region, regionIndex) => {
    const storeCount = 10 + Math.floor(Math.random() * 5);
    for (let i = 0; i < storeCount; i++) {
      const storeIndex = (regionIndex * 10 + i) % storeNames.length;
      const supervisorIndex = Math.floor(Math.random() * supervisors.length);
      stores.push({
        id: `store-${region}-${i}`,
        region,
        storeName: `${region}${storeNames[storeIndex]}`,
        supervisor: supervisors[supervisorIndex],
        rating: Number((3.5 + Math.random() * 1.5).toFixed(2)),
        negativeCount: Math.floor(Math.random() * 20),
        replyRate24h: Number((70 + Math.random() * 30).toFixed(1)),
      });
    }
  });
  
  return stores;
}

export function getStoreHealthBubbleData(): StoreHealthBubbleData[] {
  const stores: StoreHealthBubbleData[] = [];
  
  REGIONS.forEach((region, regionIndex) => {
    const storeCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < storeCount; i++) {
      const storeIndex = (regionIndex * 10 + i) % storeNames.length;
      const avgRating = Number((2.5 + Math.random() * 2.5).toFixed(2));
      const negativeRate = Number((Math.random() * 15).toFixed(1));
      const reviewCount = 50 + Math.floor(Math.random() * 500);
      
      let riskLevel: 'risk' | 'normal' | 'advantage' = 'normal';
      if (avgRating < 3.5 || negativeRate > 10) {
        riskLevel = 'risk';
      } else if (avgRating > 4.5 && negativeRate < 3) {
        riskLevel = 'advantage';
      }
      
      stores.push({
        id: `bubble-${region}-${i}`,
        storeName: `${region}${storeNames[storeIndex]}`,
        region,
        avgRating,
        negativeRate,
        reviewCount,
        riskLevel,
      });
    }
  });
  
  return stores;
}

export function getStoreExecutionScatterData(): StoreExecutionScatterData[] {
  const stores: StoreExecutionScatterData[] = [];
  
  REGIONS.forEach((region, regionIndex) => {
    const storeCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < storeCount; i++) {
      const storeIndex = (regionIndex * 10 + i) % storeNames.length;
      const avgRating = Number((2.5 + Math.random() * 2.5).toFixed(2));
      const replyRate24h = Number((40 + Math.random() * 60).toFixed(1));
      
      let riskLevel: 'risk' | 'normal' | 'advantage' = 'normal';
      if (avgRating < 3.5 || replyRate24h < 60) {
        riskLevel = 'risk';
      } else if (avgRating > 4.5 && replyRate24h > 90) {
        riskLevel = 'advantage';
      }
      
      stores.push({
        id: `scatter-${region}-${i}`,
        storeName: `${region}${storeNames[storeIndex]}`,
        region,
        avgRating,
        replyRate24h,
        riskLevel,
      });
    }
  });
  
  return stores;
}

export function getStoreDetailById(storeId: string): StoreDetail | null {
  const storeList = getStoreList();
  const store = storeList.find(s => s.id === storeId);
  
  if (!store) return null;
  
  const avgRating = store.rating;
  const negativeRate = Number((store.negativeCount / 100 * 10).toFixed(1));
  const replyRate = store.replyRate24h;
  const totalReviews = 150 + Math.floor(Math.random() * 300);
  
  const regionMap: Record<string, '华东' | '华北' | '华南' | '华中' | '西南' | '东北'> = {
    '华东': '华东',
    '华北': '华北',
    '华南': '华南',
    '华中': '华中',
    '西南': '西南',
    '东北': '东北',
  };
  
  const region = regionMap[store.region] || '华东';
  
  return {
    id: store.id,
    name: store.storeName,
    address: `${store.region}某某路${Math.floor(Math.random() * 999) + 1}号`,
    region,
    province: region === '华东' ? '上海' : region === '华北' ? '北京' : region === '华南' ? '广东' : region === '华中' ? '湖北' : region === '西南' ? '四川' : '辽宁',
    openDate: new Date('2023-01-01'),
    totalReviews,
    avgRating,
    negativeReviews: store.negativeCount,
    negativeRate,
    replyRate,
    recentReviews: [
      {
        id: 'review-1',
        storeId: store.id,
        storeName: store.storeName,
        channel: '美团',
        rating: 5,
        content: '味道很好，服务态度也很棒！',
        tags: ['口味好', '服务好'],
        createTime: new Date(),
        replied: true,
        replyTime: new Date(),
        replyContent: '感谢您的好评！',
      },
      {
        id: 'review-2',
        storeId: store.id,
        storeName: store.storeName,
        channel: '大众点评',
        rating: 2,
        content: '等了很久，服务态度一般',
        tags: ['等待时间长', '服务态度差'],
        createTime: new Date(),
        replied: false,
      },
    ],
    issueDistribution: [
      { name: '口味问题', value: 35 },
      { name: '服务态度', value: 28 },
      { name: '等待时间', value: 22 },
      { name: '环境卫生', value: 15 },
    ],
    commercialAreaRanking: {
      area: '商圈A',
      category: '快餐',
      rank: Math.floor(Math.random() * 10) + 1,
    },
    positiveTagsTop3: [
      { name: '口味好', value: 85 },
      { name: '服务热情', value: 62 },
      { name: '环境好', value: 48 },
    ],
    negativeTagsTop3: [
      { name: '等待时间长', value: 25 },
      { name: '服务态度差', value: 18 },
      { name: '分量少', value: 12 },
    ],
  };
}
