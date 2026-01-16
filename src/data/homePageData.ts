export interface HomeKPIData {
  brandScore: number;
  brandScoreTrend: number;
  reviewCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  negativePerTenThousand: number;
  negativePerTenThousandTrend: number;
  negativeRate: number;
  negativeRateTrend: number;
  foodSafetyRisks: number;
  foodSafetyPending: number;
  replyRate: number;
  replyRateVsIndustry: number;
}

export interface RatingTrendPoint {
  month: string;
  total: number;
  meituan: number;
  dianping: number;
}

export interface StoreDistributionPoint {
  month: string;
  below3: number;
  from3to35: number;
  from4: number;
  above45: number;
  below3Pct: number;
  from3to35Pct: number;
  from4Pct: number;
  above45Pct: number;
}

export interface MarketTrendData {
  market: string;
  data: number[];
}

export interface TopStoreItem {
  market: string;
  storeId: string;
  storeName: string;
  rating: number;
  change: number;
}

export function getHomeKPIData(): HomeKPIData {
  return {
    brandScore: 4.7,
    brandScoreTrend: 0.1,
    reviewCount: 650,
    positiveCount: 600,
    neutralCount: 45,
    negativeCount: 5,
    negativePerTenThousand: 0.85,
    negativePerTenThousandTrend: -0.12,
    negativeRate: 2.3,
    negativeRateTrend: 0.5,
    foodSafetyRisks: 154,
    foodSafetyPending: -13.5,
    replyRate: 98.5,
    replyRateVsIndustry: 8,
  };
}

export function getRatingTrendData(): RatingTrendPoint[] {
  return [
    { month: '2025-08', total: 4.28, meituan: 4.25, dianping: 4.30 },
    { month: '2025-09', total: 4.27, meituan: 4.24, dianping: 4.29 },
    { month: '2025-10', total: 4.25, meituan: 4.22, dianping: 4.28 },
    { month: '2025-11', total: 4.21, meituan: 4.18, dianping: 4.24 },
    { month: '2025-12', total: 4.18, meituan: 4.15, dianping: 4.21 },
    { month: '2026-01', total: 4.17, meituan: 4.14, dianping: 4.20 },
  ];
}

export function getStoreDistributionData(): StoreDistributionPoint[] {
  return [
    { month: '2025-08', below3: 45, from3to35: 47, from4: 155, above45: 78, below3Pct: 13.85, from3to35Pct: 14.46, from4Pct: 47.69, above45Pct: 24.00 },
    { month: '2025-09', below3: 50, from3to35: 52, from4: 196, above45: 77, below3Pct: 13.33, from3to35Pct: 13.87, from4Pct: 52.27, above45Pct: 20.53 },
    { month: '2025-10', below3: 48, from3to35: 49, from4: 185, above45: 73, below3Pct: 13.52, from3to35Pct: 13.80, from4Pct: 52.11, above45Pct: 20.56 },
    { month: '2025-11', below3: 52, from3to35: 47, from4: 152, above45: 52, below3Pct: 17.16, from3to35Pct: 15.51, from4Pct: 50.17, above45Pct: 17.16 },
    { month: '2025-12', below3: 55, from3to35: 55, from4: 158, above45: 45, below3Pct: 17.57, from3to35Pct: 17.57, from4Pct: 50.48, above45Pct: 14.38 },
    { month: '2026-01', below3: 58, from3to35: 56, from4: 164, above45: 42, below3Pct: 18.13, from3to35Pct: 17.50, from4Pct: 51.25, above45Pct: 13.13 },
  ];
}

export function getMarketTrendData(): { markets: MarketTrendData[], months: string[] } {
  const months = ['2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01'];
  const markets: MarketTrendData[] = [
    { market: '华南市场', data: [4.47, 4.48, 4.45, 4.42, 4.40, 4.42] },
    { market: '华中市场', data: [4.35, 4.38, 4.40, 4.38, 4.35, 4.33] },
    { market: '山东市场', data: [4.28, 4.30, 4.32, 4.28, 4.25, 4.22] },
    { market: '上海市场', data: [4.52, 4.55, 4.58, 4.60, 4.58, 4.55] },
    { market: '苏锡市场', data: [4.18, 4.20, 4.22, 4.20, 4.18, 4.15] },
    { market: '西南市场', data: [4.05, 4.08, 4.10, 4.08, 4.05, 4.02] },
    { market: '浙江市场', data: [4.42, 4.45, 4.48, 4.50, 4.48, 4.45] },
  ];
  return { markets, months };
}

export function getTopStoresData(): { redList: TopStoreItem[], blackList: TopStoreItem[] } {
  const redList: TopStoreItem[] = [
    { market: '东北市场', storeId: 'STORE0001', storeName: '哈尔滨门店', rating: 4.65, change: 0.12 },
    { market: '东北市场', storeId: 'STORE0002', storeName: '沈阳路门店', rating: 4.4, change: 0.08 },
    { market: '东北市场', storeId: 'STORE0003', storeName: '万象汇门店', rating: 4.3, change: 0.05 },
    { market: '华东市场', storeId: 'STORE0004', storeName: '中山路门店', rating: 4.65, change: 0.15 },
    { market: '华东市场', storeId: 'STORE0005', storeName: '复兴路门店', rating: 4.4, change: 0.10 },
    { market: '华东市场', storeId: 'STORE0006', storeName: '常熟路门店', rating: 4.3, change: 0.03 },
  ];

  const blackList: TopStoreItem[] = [
    { market: '东北市场', storeId: 'STORE0010', storeName: '长春店', rating: 3.2, change: -0.15 },
    { market: '东北市场', storeId: 'STORE0011', storeName: '大连店', rating: 3.4, change: -0.08 },
    { market: '东北市场', storeId: 'STORE0012', storeName: '吉林店', rating: 3.5, change: -0.05 },
    { market: '华东市场', storeId: 'STORE0020', storeName: '南京西路店', rating: 3.3, change: -0.12 },
    { market: '华东市场', storeId: 'STORE0021', storeName: '徐家汇店', rating: 3.45, change: -0.10 },
    { market: '华东市场', storeId: 'STORE0022', storeName: '人民广场店', rating: 3.5, change: -0.03 },
  ];

  return { redList, blackList };
}

export function getAIInsight(): string {
  return '本周大盘评分下降0.1分，主要受华东大区"服务态度"类差评影响（占比60%），建议重点排查数市高峰期的服务SOP执行情况。';
}
