export interface ReviewTrendItem {
  month: string;
  positiveCount: number;
  negativeCount: number;
}

export interface MarketDistributionItem {
  market: string;
  positiveCount: number;
  negativeCount: number;
}

export interface MarketTrendItem {
  date: string;
  [market: string]: string | number;
}

export interface DimensionItem {
  dimension: string;
  positiveCount: number;
  negativeCount: number;
}

export interface TagL2Item {
  name: string;
  positiveCount: number;
  negativeCount: number;
}

export interface TagL3Item {
  name: string;
  count: number;
  stores: Array<{ storeId: string; storeName: string; count: number }>;
}

export interface WordCloudItem {
  name: string;
  value: number;
}

export function getReviewTrendData(granularity: 'day' | 'week' | 'month' = 'month'): ReviewTrendItem[] {
  if (granularity === 'month') {
    return [
      { month: '2024-06', positiveCount: 11800, negativeCount: 441 },
      { month: '2024-07', positiveCount: 11174, negativeCount: 389 },
      { month: '2024-08', positiveCount: 10625, negativeCount: 331 },
      { month: '2024-09', positiveCount: 10343, negativeCount: 398 },
      { month: '2024-10', positiveCount: 9458, negativeCount: 399 },
      { month: '2024-11', positiveCount: 10200, negativeCount: 356 },
      { month: '2024-12', positiveCount: 9800, negativeCount: 320 },
    ];
  } else if (granularity === 'week') {
    return [
      { month: 'W1', positiveCount: 2850, negativeCount: 95 },
      { month: 'W2', positiveCount: 2720, negativeCount: 88 },
      { month: 'W3', positiveCount: 2680, negativeCount: 82 },
      { month: 'W4', positiveCount: 2550, negativeCount: 78 },
      { month: 'W5', positiveCount: 2890, negativeCount: 92 },
      { month: 'W6', positiveCount: 2780, negativeCount: 85 },
    ];
  } else {
    return [
      { month: '12-01', positiveCount: 380, negativeCount: 12 },
      { month: '12-02', positiveCount: 420, negativeCount: 15 },
      { month: '12-03', positiveCount: 395, negativeCount: 11 },
      { month: '12-04', positiveCount: 410, negativeCount: 14 },
      { month: '12-05', positiveCount: 385, negativeCount: 10 },
      { month: '12-06', positiveCount: 445, negativeCount: 18 },
      { month: '12-07', positiveCount: 520, negativeCount: 22 },
      { month: '12-08', positiveCount: 490, negativeCount: 16 },
      { month: '12-09', positiveCount: 405, negativeCount: 13 },
      { month: '12-10', positiveCount: 415, negativeCount: 14 },
    ];
  }
}

export function getMarketDistributionData(): MarketDistributionItem[] {
  return [
    { market: '东北市场', positiveCount: 23, negativeCount: 15 },
    { market: '华南市场', positiveCount: 16, negativeCount: 12 },
    { market: '华中市场', positiveCount: 16, negativeCount: 10 },
    { market: '京津市场', positiveCount: 20, negativeCount: 254 },
    { market: '山东市场', positiveCount: 40, negativeCount: 8 },
    { market: '上海市场', positiveCount: 27, negativeCount: 324 },
    { market: '苏皖市场', positiveCount: 10, negativeCount: 317 },
    { market: '西南市场', positiveCount: 13, negativeCount: 276 },
    { market: '浙江市场', positiveCount: 71, negativeCount: 229 },
  ].sort((a, b) => b.negativeCount - a.negativeCount);
}

export function getMarketTrendDataWeekly(): { dates: string[]; markets: string[]; data: Record<string, number[]> } {
  const markets = ['东北市场', '华南市场', '华中市场', '京津市场', '山东市场', '上海市场', '苏皖市场', '西南市场', '浙江市场'];
  const dates = ['2024-01-W1', '2024-01-W2', '2024-01-W3', '2024-01-W4', '2024-02-W1', '2024-02-W2', '2024-02-W3', '2024-02-W4'];
  
  const data: Record<string, number[]> = {
    '东北市场': [8.5, 9.2, 7.8, 8.1, 7.5, 6.9, 7.2, 7.0],
    '华南市场': [5.2, 5.8, 6.1, 5.5, 5.9, 6.2, 5.7, 5.4],
    '华中市场': [4.8, 5.1, 4.5, 4.9, 5.2, 4.7, 5.0, 4.6],
    '京津市场': [12.5, 11.8, 13.2, 12.1, 11.5, 12.8, 11.9, 12.3],
    '山东市场': [3.2, 3.5, 3.1, 3.8, 3.4, 3.0, 3.6, 3.3],
    '上海市场': [15.2, 14.8, 16.1, 15.5, 14.2, 15.8, 14.5, 15.0],
    '苏皖市场': [10.5, 11.2, 10.8, 11.5, 10.2, 11.8, 10.1, 11.0],
    '西南市场': [6.8, 7.2, 6.5, 7.0, 6.9, 6.4, 7.1, 6.6],
    '浙江市场': [8.2, 7.8, 8.5, 8.0, 7.5, 8.8, 7.9, 8.3],
  };

  return { dates, markets, data };
}

export function getMarketTrendDataDaily(): { dates: string[]; markets: string[]; data: Record<string, number[]> } {
  const markets = ['东北市场', '华南市场', '华中市场', '京津市场', '山东市场', '上海市场', '苏皖市场', '西南市场', '浙江市场'];
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date('2024-02-01');
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  
  const generateData = (base: number, variance: number) => 
    dates.map(() => Math.max(0, base + (Math.random() - 0.5) * variance));

  const data: Record<string, number[]> = {
    '东北市场': generateData(7.5, 3),
    '华南市场': generateData(5.5, 2),
    '华中市场': generateData(4.8, 2),
    '京津市场': generateData(12, 4),
    '山东市场': generateData(3.5, 1.5),
    '上海市场': generateData(15, 5),
    '苏皖市场': generateData(10.5, 3),
    '西南市场': generateData(6.8, 2.5),
    '浙江市场': generateData(8, 3),
  };

  return { dates, markets, data };
}

export function getDimensionData(): DimensionItem[] {
  return [
    { dimension: '商品', positiveCount: 85, negativeCount: 45 },
    { dimension: '环境', positiveCount: 60, negativeCount: 35 },
    { dimension: '服务', positiveCount: 40, negativeCount: 55 },
    { dimension: '配送', positiveCount: 30, negativeCount: 25 },
  ];
}

export function getTagL2Data(dimension: string): TagL2Item[] {
  const l2Data: Record<string, TagL2Item[]> = {
    '商品': [
      { name: '口味', positiveCount: 45, negativeCount: 15 },
      { name: '新鲜度', positiveCount: 25, negativeCount: 20 },
      { name: '分量', positiveCount: 15, negativeCount: 10 },
    ],
    '环境': [
      { name: '卫生', positiveCount: 30, negativeCount: 20 },
      { name: '氛围', positiveCount: 20, negativeCount: 10 },
      { name: '设施', positiveCount: 10, negativeCount: 5 },
    ],
    '服务': [
      { name: '态度', positiveCount: 20, negativeCount: 30 },
      { name: '效率', positiveCount: 15, negativeCount: 20 },
      { name: '专业度', positiveCount: 5, negativeCount: 5 },
    ],
    '配送': [
      { name: '速度', positiveCount: 15, negativeCount: 15 },
      { name: '包装', positiveCount: 10, negativeCount: 8 },
      { name: '准确性', positiveCount: 5, negativeCount: 2 },
    ],
  };
  return l2Data[dimension] || [];
}

export function getTagL3Data(dimension: string, l2Tag: string): TagL3Item[] {
  const l3Data: Record<string, Record<string, TagL3Item[]>> = {
    '服务': {
      '态度': [
        { name: '服务员态度差', count: 18, stores: [
          { storeId: 'STORE0020', storeName: '南京西路店', count: 5 },
          { storeId: 'STORE0021', storeName: '徐家汇店', count: 4 },
          { storeId: 'STORE0022', storeName: '人民广场店', count: 3 },
        ]},
        { name: '不理睬顾客', count: 8, stores: [
          { storeId: 'STORE0010', storeName: '长春店', count: 3 },
          { storeId: 'STORE0011', storeName: '大连店', count: 2 },
        ]},
        { name: '态度冷漠', count: 4, stores: [
          { storeId: 'STORE0012', storeName: '吉林店', count: 2 },
        ]},
      ],
      '效率': [
        { name: '上菜太慢', count: 12, stores: [
          { storeId: 'STORE0020', storeName: '南京西路店', count: 4 },
        ]},
        { name: '等位时间长', count: 8, stores: [
          { storeId: 'STORE0021', storeName: '徐家汇店', count: 3 },
        ]},
      ],
    },
    '商品': {
      '口味': [
        { name: '太咸', count: 10, stores: [
          { storeId: 'STORE0001', storeName: '哈尔滨门店', count: 3 },
        ]},
        { name: '不新鲜', count: 5, stores: [
          { storeId: 'STORE0002', storeName: '沈阳路门店', count: 2 },
        ]},
      ],
    },
  };
  return l3Data[dimension]?.[l2Tag] || [];
}

export function getNegativeWordCloud(): WordCloudItem[] {
  return [
    { name: '服务差', value: 88 },
    { name: '态度差', value: 76 },
    { name: '等太久', value: 65 },
    { name: '不新鲜', value: 54 },
    { name: '太贵', value: 48 },
    { name: '量少', value: 42 },
    { name: '难吃', value: 38 },
    { name: '脏', value: 35 },
    { name: '异物', value: 32 },
    { name: '冷了', value: 28 },
    { name: '配送慢', value: 25 },
    { name: '包装破损', value: 22 },
    { name: '漏餐', value: 18 },
    { name: '变质', value: 15 },
    { name: '拉肚子', value: 12 },
  ];
}

export function getPositiveWordCloud(): WordCloudItem[] {
  return [
    { name: '好吃', value: 156 },
    { name: '新鲜', value: 132 },
    { name: '服务好', value: 98 },
    { name: '环境好', value: 87 },
    { name: '实惠', value: 76 },
    { name: '快', value: 65 },
    { name: '干净', value: 58 },
    { name: '热情', value: 52 },
    { name: '推荐', value: 45 },
    { name: '量大', value: 42 },
  ];
}

export function getAISummary(mode: 'positive' | 'negative'): string {
  if (mode === 'negative') {
    return '差评高发区总结：主要集中在华东领域，其中门店TOP5分别是南京西路店（差评32条）、徐家汇店（差评28条）、人民广场店（差评25条）、长春店（差评22条）、大连店（差评18条）。核心问题集中在"服务态度"类（占比42%），建议重点排查高峰期服务SOP执行情况。';
  }
  return '好评高发区总结：主要集中在华北和东北区域，门店TOP5分别是哈尔滨门店（好评156条）、沈阳路门店（好评132条）、万象汇门店（好评98条）。顾客满意点集中在"口味"和"新鲜度"维度。';
}
