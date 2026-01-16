import { MARKETS } from './constants';

export interface RegionalOverviewMetrics {
  storeCount: number;
  storeCountChange: number;
  avgRating: number;
  avgRatingChange: number;
  totalRevenue: number;
  totalRevenueChange: number;
  totalReviews: number;
  totalReviewsChange: number;
}

export interface MonthlyRatingDistribution {
  month: string;
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
}

export interface NegativeAnalysisMetrics {
  negativeCount: number;
  negativeCountChange: number;
  negativeRate: number;
  negativeRateChange: number;
  memberNegativeCount: number;
  memberNegativeCountChange: number;
}

export interface QSCVTagData {
  name: string;
  count: number;
  percentage: number;
  children?: QSCVTagData[];
}

export interface RegionalRanking {
  id: string;
  name: string;
  nationalRank: number;
  regionalRank: number;
  rankChange: number;
  avgRating: number;
  negativeRate: number;
  market: string;
}

export function getRegionalOverviewMetrics(): RegionalOverviewMetrics {
  return {
    storeCount: 328,
    storeCountChange: 12,
    avgRating: 4.52,
    avgRatingChange: 0.08,
    totalRevenue: 2856.8,
    totalRevenueChange: 15.2,
    totalReviews: 45680,
    totalReviewsChange: 8.5,
  };
}

export function getMonthlyRatingDistribution(): MonthlyRatingDistribution[] {
  const months = ['7月', '8月', '9月', '10月', '11月', '12月'];
  return months.map((month, index) => {
    const base = 300 + index * 10;
    return {
      month,
      star5: Math.floor(base * 0.45 + Math.random() * 20),
      star4: Math.floor(base * 0.30 + Math.random() * 15),
      star3: Math.floor(base * 0.12 + Math.random() * 10),
      star2: Math.floor(base * 0.08 + Math.random() * 5),
      star1: Math.floor(base * 0.05 + Math.random() * 5),
    };
  });
}

export function getNegativeAnalysisMetrics(): NegativeAnalysisMetrics {
  return {
    negativeCount: 1256,
    negativeCountChange: -5.2,
    negativeRate: 2.75,
    negativeRateChange: -0.3,
    memberNegativeCount: 342,
    memberNegativeCountChange: 8.1,
  };
}

export function getQSCVTagData(): QSCVTagData[] {
  return [
    {
      name: 'Q-品质',
      count: 520,
      percentage: 41.4,
      children: [
        { name: '食材新鲜度', count: 180, percentage: 34.6 },
        { name: '口味问题', count: 150, percentage: 28.8 },
        { name: '菜品温度', count: 110, percentage: 21.2 },
        { name: '分量不足', count: 80, percentage: 15.4 },
      ],
    },
    {
      name: 'S-服务',
      count: 380,
      percentage: 30.2,
      children: [
        { name: '服务态度', count: 160, percentage: 42.1 },
        { name: '上菜速度', count: 120, percentage: 31.6 },
        { name: '点餐问题', count: 60, percentage: 15.8 },
        { name: '结账问题', count: 40, percentage: 10.5 },
      ],
    },
    {
      name: 'C-清洁',
      count: 220,
      percentage: 17.5,
      children: [
        { name: '餐具卫生', count: 90, percentage: 40.9 },
        { name: '环境整洁', count: 70, percentage: 31.8 },
        { name: '异物问题', count: 60, percentage: 27.3 },
      ],
    },
    {
      name: 'V-价值',
      count: 136,
      percentage: 10.8,
      children: [
        { name: '性价比低', count: 80, percentage: 58.8 },
        { name: '优惠问题', count: 36, percentage: 26.5 },
        { name: '会员权益', count: 20, percentage: 14.7 },
      ],
    },
  ];
}

export function getStoreRankings(page: number = 1, pageSize: number = 15): { data: RegionalRanking[]; total: number } {
  const storeNames = [
    '朝阳门店', '西单店', '国贸店', '望京店', '中关村店',
    '徐汇店', '浦东店', '静安店', '虹桥店', '陆家嘴店',
    '天河店', '海珠店', '越秀店', '番禺店', '白云店',
    '下沙店', '西湖店', '滨江店', '拱墅店', '萧山店',
    '鼓楼店', '建邺店', '玄武店', '秦淮店', '栖霞店',
    '朝阳店', '海淀店', '东城店', '西城店', '丰台店',
  ];

  const allData: RegionalRanking[] = storeNames.map((name, index) => ({
    id: `store_${index}`,
    name,
    nationalRank: index + 1,
    regionalRank: (index % 10) + 1,
    rankChange: Math.floor(Math.random() * 10) - 5,
    avgRating: 4.8 - index * 0.02,
    negativeRate: 1.5 + index * 0.1,
    market: MARKETS[index % MARKETS.length],
  }));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: allData.slice(start, end),
    total: allData.length,
  };
}


export function getRegionalAISummary(): string {
  return '华东区域服务表现优异，服务态度好评率达92%，建议继续保持。东北区域质量问题突出，食材新鲜度差评占比38%，建议重点关注供应链管理和冷链配送。华南区域整体平稳，但会员差评有上升趋势，需关注会员服务体验。';
}

export type NegativeMetricType = 'negativeCount' | 'negativeRate' | 'negativePerTenThousand';

export interface RegionalNegativeTrendData {
  month: string;
  [region: string]: number | string;
}

export function getRegionalNegativeTrendData(metricType: NegativeMetricType): RegionalNegativeTrendData[] {
  const months = ['7月', '8月', '9月', '10月', '11月', '12月'];
  const regions = ['华东', '华北', '华南', '华中', '西南', '东北'];
  
  return months.map((month, monthIndex) => {
    const data: RegionalNegativeTrendData = { month };
    
    regions.forEach((region, regionIndex) => {
      const baseValue = 100 + regionIndex * 20;
      const trend = monthIndex * (regionIndex % 2 === 0 ? -2 : 3);
      
      if (metricType === 'negativeCount') {
        data[region] = Math.floor(baseValue + trend + Math.random() * 30);
      } else if (metricType === 'negativeRate') {
        const baseRate = 2 + regionIndex * 0.3;
        data[region] = Number((baseRate + (monthIndex - 3) * 0.1 + Math.random() * 0.5).toFixed(2));
      } else {
        const basePerTenK = 0.8 + regionIndex * 0.15;
        data[region] = Number((basePerTenK + (monthIndex - 2) * 0.05 + Math.random() * 0.2).toFixed(2));
      }
    });
    
    return data;
  });
}

export function getRegionsList(): string[] {
  return ['华东', '华北', '华南', '华中', '西南', '东北'];
}

export interface QSCVTrendDataPoint {
  month: string;
  [tagName: string]: number | string;
}

export interface QSCVTagConfig {
  name: string;
  children: string[];
}

export const QSCV_TAG_CONFIG: QSCVTagConfig[] = [
  { name: 'Q-品质', children: ['食材新鲜度', '口味问题', '菜品温度', '分量不足'] },
  { name: 'S-服务', children: ['服务态度', '上菜速度', '点餐问题', '结账问题'] },
  { name: 'C-清洁', children: ['餐具卫生', '环境整洁', '异物问题'] },
  { name: 'V-价值', children: ['性价比低', '优惠问题', '会员权益'] },
];

export function getQSCVTrendData(level: 'L1' | 'L2', parentTag?: string): QSCVTrendDataPoint[] {
  const months = ['7月', '8月', '9月', '10月', '11月', '12月'];
  
  if (level === 'L1') {
    const tags = QSCV_TAG_CONFIG.map(t => t.name);
    return months.map((month, monthIndex) => {
      const data: QSCVTrendDataPoint = { month };
      tags.forEach((tag, tagIndex) => {
        const baseValue = [520, 380, 220, 136][tagIndex];
        const trend = (monthIndex - 3) * (tagIndex % 2 === 0 ? 8 : -5);
        data[tag] = Math.floor(baseValue + trend + Math.random() * 30);
      });
      return data;
    });
  } else {
    const parentConfig = QSCV_TAG_CONFIG.find(t => t.name === parentTag);
    if (!parentConfig) return [];
    
    return months.map((month, monthIndex) => {
      const data: QSCVTrendDataPoint = { month };
      parentConfig.children.forEach((child, childIndex) => {
        const baseValue = 80 + childIndex * 20;
        const trend = (monthIndex - 2) * (childIndex % 2 === 0 ? 5 : -3);
        data[child] = Math.floor(baseValue + trend + Math.random() * 15);
      });
      return data;
    });
  }
}

export function getQSCVTrendDataByRegion(region: string, level: 'L1' | 'L2', parentTag?: string): QSCVTrendDataPoint[] {
  const months = ['7月', '8月', '9月', '10月', '11月', '12月'];
  const regions = ['华东', '华北', '华南', '华中', '西南', '东北'];
  const regionIndex = regions.indexOf(region);
  const regionMultiplier = 0.7 + regionIndex * 0.1;
  
  if (level === 'L1') {
    const tags = QSCV_TAG_CONFIG.map(t => t.name);
    return months.map((month, monthIndex) => {
      const data: QSCVTrendDataPoint = { month };
      tags.forEach((tag, tagIndex) => {
        const baseValue = [520, 380, 220, 136][tagIndex] * regionMultiplier;
        const trend = (monthIndex - 3) * (tagIndex % 2 === 0 ? 8 : -5);
        data[tag] = Math.floor(baseValue + trend + Math.random() * 30);
      });
      return data;
    });
  } else {
    const parentConfig = QSCV_TAG_CONFIG.find(t => t.name === parentTag);
    if (!parentConfig) return [];
    
    return months.map((month, monthIndex) => {
      const data: QSCVTrendDataPoint = { month };
      parentConfig.children.forEach((child, childIndex) => {
        const baseValue = (80 + childIndex * 20) * regionMultiplier;
        const trend = (monthIndex - 2) * (childIndex % 2 === 0 ? 5 : -3);
        data[child] = Math.floor(baseValue + trend + Math.random() * 15);
      });
      return data;
    });
  }
}

export function getQSCVTagNames(level: 'L1' | 'L2', parentTag?: string): string[] {
  if (level === 'L1') {
    return QSCV_TAG_CONFIG.map(t => t.name);
  } else {
    const parentConfig = QSCV_TAG_CONFIG.find(t => t.name === parentTag);
    return parentConfig ? parentConfig.children : [];
  }
}

export interface NegativeKeyword {
  name: string;
  value: number;
}

export function getNegativeKeywordsByRegion(region: string): NegativeKeyword[] {
  const keywordsByRegion: Record<string, NegativeKeyword[]> = {
    '华东': [
      { name: '上菜慢', value: 156 },
      { name: '服务态度差', value: 134 },
      { name: '口味不佳', value: 98 },
      { name: '分量少', value: 87 },
      { name: '价格贵', value: 76 },
      { name: '环境脏', value: 65 },
      { name: '等位久', value: 58 },
      { name: '菜品凉了', value: 52 },
      { name: '有异物', value: 45 },
      { name: '餐具不干净', value: 38 },
    ],
    '华北': [
      { name: '服务态度差', value: 142 },
      { name: '上菜慢', value: 128 },
      { name: '分量少', value: 105 },
      { name: '口味咸', value: 92 },
      { name: '环境吵', value: 78 },
      { name: '价格贵', value: 68 },
      { name: '空调不足', value: 55 },
      { name: '停车难', value: 48 },
      { name: '餐具破损', value: 42 },
      { name: '菜品不新鲜', value: 35 },
    ],
    '华南': [
      { name: '口味偏咸', value: 168 },
      { name: '上菜慢', value: 145 },
      { name: '空调太冷', value: 112 },
      { name: '服务冷淡', value: 98 },
      { name: '分量少', value: 85 },
      { name: '价格虚高', value: 72 },
      { name: '等位久', value: 62 },
      { name: '卫生差', value: 55 },
      { name: '噪音大', value: 48 },
      { name: '菜品油腻', value: 42 },
    ],
    '华中': [
      { name: '服务慢', value: 138 },
      { name: '口味淡', value: 125 },
      { name: '上菜慢', value: 108 },
      { name: '环境差', value: 92 },
      { name: '分量不足', value: 78 },
      { name: '价格不合理', value: 65 },
      { name: '态度冷漠', value: 58 },
      { name: '位置难找', value: 45 },
      { name: '菜品凉', value: 38 },
      { name: '餐具脏', value: 32 },
    ],
    '西南': [
      { name: '不够辣', value: 155 },
      { name: '上菜慢', value: 132 },
      { name: '服务差', value: 118 },
      { name: '口味不正宗', value: 95 },
      { name: '价格贵', value: 82 },
      { name: '分量少', value: 68 },
      { name: '环境嘈杂', value: 55 },
      { name: '等位时间长', value: 48 },
      { name: '菜品油', value: 42 },
      { name: '卫生问题', value: 35 },
    ],
    '东北': [
      { name: '分量太少', value: 175 },
      { name: '服务态度', value: 148 },
      { name: '上菜速度', value: 125 },
      { name: '口味偏淡', value: 102 },
      { name: '价格高', value: 88 },
      { name: '环境一般', value: 72 },
      { name: '菜品凉', value: 58 },
      { name: '暖气不足', value: 52 },
      { name: '停车不便', value: 45 },
      { name: '餐具问题', value: 38 },
    ],
  };
  
  return keywordsByRegion[region] || keywordsByRegion['华东'];
}

export interface KeywordReview {
  id: string;
  content: string;
  rating: number;
  storeName: string;
  channel: string;
  createTime: Date;
  keyword: string;
}

export interface RegionRankingItem {
  id: string;
  name: string;
  nationalRank: number;
  rankChange: number;
  negativePerTenThousand: number;
  negativeCount: number;
  storeCount: number;
}

export interface SupervisorGroupRankingItem {
  id: string;
  name: string;
  region: string;
  nationalRank: number;
  regionalRank: number;
  rankChange: number;
  negativePerTenThousand: number;
  negativeCount: number;
  supervisorCount: number;
}

export interface SupervisorRankingItem {
  id: string;
  name: string;
  group: string;
  region: string;
  nationalRank: number;
  regionalRank: number;
  groupRank: number;
  rankChange: number;
  negativePerTenThousand: number;
  negativeCount: number;
  storeCount: number;
}

export interface StoreRankingItem {
  id: string;
  name: string;
  supervisor: string;
  group: string;
  region: string;
  nationalRank: number;
  regionalRank: number;
  groupRank: number;
  supervisorRank: number;
  rankChange: number;
  negativePerTenThousand: number;
  negativeCount: number;
  avgRating: number;
}

export function getRegionRankings(): RegionRankingItem[] {
  const regions = [
    { name: '华东', negativePerTenThousand: 0.82, negativeCount: 156, storeCount: 85 },
    { name: '华北', negativePerTenThousand: 0.95, negativeCount: 142, storeCount: 62 },
    { name: '华南', negativePerTenThousand: 1.05, negativeCount: 168, storeCount: 58 },
    { name: '华中', negativePerTenThousand: 1.12, negativeCount: 138, storeCount: 48 },
    { name: '西南', negativePerTenThousand: 1.25, negativeCount: 155, storeCount: 42 },
    { name: '东北', negativePerTenThousand: 1.38, negativeCount: 175, storeCount: 33 },
  ];
  
  return regions
    .sort((a, b) => a.negativePerTenThousand - b.negativePerTenThousand)
    .map((r, index) => ({
      id: `region_${index}`,
      name: r.name,
      nationalRank: index + 1,
      rankChange: Math.floor(Math.random() * 4) - 2,
      negativePerTenThousand: r.negativePerTenThousand,
      negativeCount: r.negativeCount,
      storeCount: r.storeCount,
    }));
}

export function getSupervisorGroupRankings(region: string): SupervisorGroupRankingItem[] {
  const groupsByRegion: Record<string, string[]> = {
    '华东': ['上海督导组', '杭州督导组', '南京督导组', '苏州督导组', '宁波督导组'],
    '华北': ['北京督导组', '天津督导组', '石家庄督导组', '太原督导组'],
    '华南': ['广州督导组', '深圳督导组', '东莞督导组', '佛山督导组'],
    '华中': ['武汉督导组', '长沙督导组', '郑州督导组', '南昌督导组'],
    '西南': ['成都督导组', '重庆督导组', '昆明督导组', '贵阳督导组'],
    '东北': ['沈阳督导组', '大连督导组', '哈尔滨督导组'],
  };
  
  const groups = groupsByRegion[region] || groupsByRegion['华东'];
  const regionIndex = ['华东', '华北', '华南', '华中', '西南', '东北'].indexOf(region);
  
  return groups.map((name, index) => ({
    id: `group_${region}_${index}`,
    name,
    region,
    nationalRank: regionIndex * 5 + index + 1,
    regionalRank: index + 1,
    rankChange: Math.floor(Math.random() * 6) - 3,
    negativePerTenThousand: 0.75 + index * 0.12 + Math.random() * 0.2,
    negativeCount: 25 + index * 8 + Math.floor(Math.random() * 15),
    supervisorCount: 3 + Math.floor(Math.random() * 3),
  })).sort((a, b) => a.negativePerTenThousand - b.negativePerTenThousand);
}

export function getSupervisorRankings(region: string, groupName: string): SupervisorRankingItem[] {
  const supervisorNames = [
    '张三', '李四', '王五', '赵六', '钱七',
  ];
  
  const regionIndex = ['华东', '华北', '华南', '华中', '西南', '东北'].indexOf(region);
  const supervisorCount = 3 + Math.floor(Math.random() * 2);
  
  return supervisorNames.slice(0, supervisorCount).map((name, index) => ({
    id: `supervisor_${region}_${groupName}_${index}`,
    name,
    group: groupName,
    region,
    nationalRank: regionIndex * 20 + index + 1,
    regionalRank: index + 1,
    groupRank: index + 1,
    rankChange: Math.floor(Math.random() * 6) - 3,
    negativePerTenThousand: 0.70 + index * 0.15 + Math.random() * 0.25,
    negativeCount: 15 + index * 5 + Math.floor(Math.random() * 10),
    storeCount: 2 + Math.floor(Math.random() * 3),
  })).sort((a, b) => a.negativePerTenThousand - b.negativePerTenThousand);
}

export function getStoreRankingsBySupervisor(region: string, groupName: string, supervisorName: string): StoreRankingItem[] {
  const storeNames = [
    '旗舰店', '万达店', '银泰店', '吾悦店', '龙湖店',
    '印象城店', '来福士店', '大悦城店', '华润店', '宝龙店',
  ];
  
  const regionIndex = ['华东', '华北', '华南', '华中', '西南', '东北'].indexOf(region);
  const storeCount = 2 + Math.floor(Math.random() * 3);
  
  return storeNames.slice(0, storeCount).map((suffix, index) => {
    const cityPrefix = groupName.replace('督导组', '');
    return {
      id: `store_${region}_${groupName}_${supervisorName}_${index}`,
      name: `${cityPrefix}${suffix}`,
      supervisor: supervisorName,
      group: groupName,
      region,
      nationalRank: regionIndex * 30 + index + 1,
      regionalRank: index + 1,
      groupRank: index + 1,
      supervisorRank: index + 1,
      rankChange: Math.floor(Math.random() * 8) - 4,
      negativePerTenThousand: 0.65 + index * 0.15 + Math.random() * 0.25,
      negativeCount: 8 + index * 3 + Math.floor(Math.random() * 8),
      avgRating: 4.8 - index * 0.08 - Math.random() * 0.2,
    };
  }).sort((a, b) => a.negativePerTenThousand - b.negativePerTenThousand);
}

export function getReviewsByKeyword(keyword: string, region: string): KeywordReview[] {
  const reviews: KeywordReview[] = [
    {
      id: 'kr1',
      content: `今天来吃饭，${keyword}的问题太严重了，等了快一个小时才上齐菜，体验很差。`,
      rating: 2,
      storeName: `${region}旗舰店`,
      channel: '美团',
      createTime: new Date(),
      keyword,
    },
    {
      id: 'kr2',
      content: `第二次来了，还是${keyword}，上次反馈的问题完全没改善，很失望。`,
      rating: 1,
      storeName: `${region}万达店`,
      channel: '大众点评',
      createTime: new Date(Date.now() - 86400000),
      keyword,
    },
    {
      id: 'kr3',
      content: `环境还可以，但是${keyword}让人不想再来了，希望能改进。`,
      rating: 2,
      storeName: `${region}中心店`,
      channel: '饿了么',
      createTime: new Date(Date.now() - 172800000),
      keyword,
    },
    {
      id: 'kr4',
      content: `朋友推荐来的，结果遇到${keyword}的情况，有点失望。`,
      rating: 2,
      storeName: `${region}商业街店`,
      channel: '美团',
      createTime: new Date(Date.now() - 259200000),
      keyword,
    },
    {
      id: 'kr5',
      content: `味道一般，主要是${keyword}问题比较明显，需要改进。`,
      rating: 3,
      storeName: `${region}购物中心店`,
      channel: '大众点评',
      createTime: new Date(Date.now() - 345600000),
      keyword,
    },
  ];
  
  return reviews;
}
