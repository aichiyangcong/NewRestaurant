export type Region = '华东' | '华北' | '华南' | '华中' | '西南' | '东北';
export type City = '上海市' | '杭州市' | '南京市' | '苏州市' | '北京市' | '天津市' | '石家庄市' | '广州市' | '深圳市' | '福州市' | '厦门市' | '武汉市' | '长沙市' | '成都市' | '重庆市' | '沈阳市' | '哈尔滨市';
export type Group = '教练1组' | '教练2组' | '教练3组' | '督导1组' | '督导2组' | '运营1组' | '运营2组';
export type Province = '浙江' | '江苏' | '上海' | '北京' | '河北' | '广东' | '福建' | '湖北' | '湖南' | '四川' | '辽宁' | '黑龙江';
export type Channel = '美团' | '饿了么' | '大众点评';
export type RiskCategory = '异物' | '腹泻' | '变质' | '服务' | '环境' | '菜品质量';
export type PageType = 'home' | 'regionalAnalysis' | 'storeAnalysis' | 'contentAnalysis' | 'reviewTools' | 'settings';
export type HomeSubViewType = 'brandScore' | 'negativeRate' | 'foodSafety' | 'replyRate';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface FilterState {
  dateRange: DateRange;
  region: Region | 'all';
  city: City | 'all';
  group: Group | 'all';
  channel: Channel | 'all';
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState;
}

export interface Store {
  id: string;
  name: string;
  region: Region;
  province: Province;
  address: string;
  openDate: Date;
}

export interface Review {
  id: string;
  storeId: string;
  storeName: string;
  rating: number;
  content: string;
  channel: Channel;
  createTime: Date;
  replied: boolean;
  replyContent?: string;
  replyTime?: Date;
  tags: string[];
  riskCategory?: RiskCategory;
}

export interface KPIData {
  brandScore: number;
  brandScoreTrend: number;
  negativeRate: number;
  negativeRateTrend: number;
  avgReplyRate: number;
  avgReplyRateTrend: number;
  foodSafetyIncidents: number;
  foodSafetyIncidentsTrend: number;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  category?: string;
}

export interface DistributionDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

export interface BubbleDataPoint {
  storeName: string;
  storeCount: number;
  complaintCount: number;
  bubbleSize: number;
  category: RiskCategory;
}

export interface BlacklistStore {
  storeId: string;
  storeName: string;
  score: number;
  negativeRate: number;
  complaintsCount: number;
  mainIssues: string[];
}

export interface StoreDetail extends Store {
  totalReviews: number;
  avgRating: number;
  negativeReviews: number;
  negativeRate: number;
  replyRate: number;
  recentReviews: Review[];
  issueDistribution: DistributionDataPoint[];
  commercialAreaRanking?: {
    area: string;
    category: string;
    rank: number;
  };
  positiveTagsTop3: DistributionDataPoint[];
  negativeTagsTop3: DistributionDataPoint[];
}

export interface WordCloudItem {
  name: string;
  value: number;
}

export interface StoreMetrics {
  storeId: string;
  storeName: string;
  avgRating: number;
  avgRatingChange: number;
  totalReviews: number;
  totalReviewsChange: number;
  negativeRate: number;
  negativeRateChange: number;
  replyRate: number;
  replyRateChange: number;
  newReviewsCount: number;
  riskLevel: 'risk' | 'normal' | 'advantage';
}

export interface StoreAnalysisKPI {
  avgRating: number;
  avgRatingChange: number;
  riskStoreCount: number;
  riskStoreCountChange: number;
  advantageStoreCount: number;
  advantageStoreCountChange: number;
  totalNewReviews: number;
  totalNewReviewsChange: number;
  avgNegativeRate: number;
  avgNegativeRateChange: number;
  avgReplyRate: number;
  avgReplyRateChange: number;
}

export interface QSCVTagL3 {
  name: string;
  count: number;
  topStores: Array<{
    storeId: string;
    storeName: string;
    count: number;
  }>;
}

export interface QSCVTagL2 {
  name: string;
  count: number;
  children: QSCVTagL3[];
  topStores: Array<{
    storeId: string;
    storeName: string;
    count: number;
  }>;
}

export interface QSCVTagL1 {
  name: string;
  count: number;
  children: QSCVTagL2[];
  topStores: Array<{
    storeId: string;
    storeName: string;
    count: number;
  }>;
}

export interface SentimentData {
  score: number;
  positive: number;
  neutral: number;
  negative: number;
  aiSummary: string;
}

export interface ContentAnalysisData {
  sentiment: SentimentData;
  qscvTags: QSCVTagL1[];
  positiveWordCloud: WordCloudItem[];
  negativeWordCloud: WordCloudItem[];
}
