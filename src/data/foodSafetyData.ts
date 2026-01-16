import { MARKETS } from './constants';

export interface FoodSafetyTrendPoint {
  date: string;
  count: number;
}

export interface MarketTrendData {
  dates: string[];
  markets: string[];
  data: Record<string, number[]>;
}

export interface KeywordData {
  keyword: string;
  count: number;
}

export interface MarketKeywords {
  market: string;
  keywords: KeywordData[];
}

export interface BlacklistStore {
  storeId: string;
  storeName: string;
  market: string;
  eventCount: number;
  changeRate: number;
  severity: 'high' | 'medium' | 'low';
}

export interface MarketBlacklist {
  market: string;
  stores: BlacklistStore[];
}

export interface ReviewVoice {
  id: string;
  content: string;
  storeName: string;
  date: string;
  platform: string;
  keyword: string;
}

export function getFoodSafetyTrendDaily(): { data: FoodSafetyTrendPoint[]; currentCount: number; changeRate: number } {
  const data: FoodSafetyTrendPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const baseCount = 15 + Math.floor(Math.random() * 10);
    const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 5 : 0;
    data.push({
      date: dateStr,
      count: baseCount + weekendBoost + Math.floor(Math.random() * 5),
    });
  }
  
  const lastWeekTotal = data.slice(-7).reduce((sum, d) => sum + d.count, 0);
  const prevWeekTotal = data.slice(-14, -7).reduce((sum, d) => sum + d.count, 0);
  const changeRate = prevWeekTotal > 0 ? ((lastWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : 0;
  
  return {
    data,
    currentCount: lastWeekTotal,
    changeRate: Math.round(changeRate * 10) / 10,
  };
}

export function getFoodSafetyTrendMonthly(): { data: FoodSafetyTrendPoint[]; currentCount: number; changeRate: number } {
  const data: FoodSafetyTrendPoint[] = [];
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  const baseCounts = [89, 76, 82, 95, 88, 102, 98, 115, 108, 92, 85, 78];
  
  for (let i = 0; i < 12; i++) {
    data.push({
      date: months[i],
      count: baseCounts[i] + Math.floor(Math.random() * 10 - 5),
    });
  }
  
  const currentMonth = data[data.length - 1].count;
  const prevMonth = data[data.length - 2].count;
  const changeRate = prevMonth > 0 ? ((currentMonth - prevMonth) / prevMonth) * 100 : 0;
  
  return {
    data,
    currentCount: currentMonth,
    changeRate: Math.round(changeRate * 10) / 10,
  };
}

export function getFoodSafetyKeywords(): KeywordData[] {
  return [
    { keyword: '异物', count: 156 },
    { keyword: '拉肚子', count: 128 },
    { keyword: '变质', count: 95 },
    { keyword: '过期', count: 87 },
    { keyword: '头发', count: 76 },
    { keyword: '虫子', count: 68 },
    { keyword: '不新鲜', count: 54 },
    { keyword: '食物中毒', count: 45 },
    { keyword: '腹泻', count: 42 },
    { keyword: '发霉', count: 38 },
  ];
}

export function getMarketFoodSafetyTrendDaily(): MarketTrendData {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  
  const data: Record<string, number[]> = {};
  
  MARKETS.forEach((market: string, index: number) => {
    const baseRate = 2 + index * 0.3;
    data[market] = dates.map((_, i) => {
      const trend = Math.sin(i / 5) * 0.5;
      const noise = (Math.random() - 0.5) * 1;
      return Math.max(0.5, Number((baseRate + trend + noise).toFixed(1)));
    });
  });
  
  return { dates, markets: MARKETS, data };
}

export function getMarketFoodSafetyTrendWeekly(): MarketTrendData {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}-${endDate.getMonth() + 1}/${endDate.getDate()}`);
  }
  
  const data: Record<string, number[]> = {};
  
  MARKETS.forEach((market: string, index: number) => {
    const baseRate = 2 + index * 0.3;
    data[market] = dates.map((_, i) => {
      const trend = Math.sin(i / 3) * 0.8;
      const noise = (Math.random() - 0.5) * 0.6;
      return Math.max(0.5, Number((baseRate + trend + noise).toFixed(1)));
    });
  });
  
  return { dates, markets: MARKETS, data };
}

export function getMarketKeywordsData(): MarketKeywords[] {
  const keywordSets: Record<string, string[]> = {
    '东北市场': ['异物', '不新鲜', '过期', '头发', '变质'],
    '华南市场': ['拉肚子', '变质', '虫子', '异物', '发霉'],
    '华中市场': ['异物', '过期', '头发', '拉肚子', '不新鲜'],
    '京津市场': ['头发', '异物', '变质', '过期', '腹泻'],
    '山东市场': ['过期', '异物', '不新鲜', '虫子', '拉肚子'],
    '上海市场': ['异物', '拉肚子', '变质', '食物中毒', '头发'],
    '苏皖市场': ['变质', '异物', '过期', '发霉', '拉肚子'],
    '西南市场': ['拉肚子', '不新鲜', '异物', '变质', '虫子'],
    '浙江市场': ['异物', '头发', '过期', '变质', '腹泻'],
  };
  
  return MARKETS.map((market: string) => ({
    market,
    keywords: (keywordSets[market] || ['异物', '拉肚子', '变质', '过期', '头发']).map((keyword: string, index: number) => ({
      keyword,
      count: Math.floor(45 - index * 8 + Math.random() * 10),
    })),
  }));
}

export function getBlacklistStores(): MarketBlacklist[] {
  const storeNames = [
    '朝阳门店', '西单店', '国贸店', '望京店', '中关村店',
    '徐汇店', '浦东店', '静安店', '虹口店', '杨浦店',
    '天河店', '海珠店', '越秀店', '番禺店', '白云店',
    '武昌店', '汉口店', '光谷店', '江汉店', '洪山店',
    '下沙店', '滨江店', '西湖店', '萧山店', '余杭店',
    '新街口店', '鼓楼店', '玄武店', '江宁店', '秦淮店',
    '历下店', '市中店', '槐荫店', '天桥店', '历城店',
    '和平店', '沈河店', '皇姑店', '大东店', '铁西店',
    '锦江店', '武侯店', '青羊店', '金牛店', '成华店',
  ];
  
  let storeIndex = 0;
  
  return MARKETS.map((market: string) => {
    const stores: BlacklistStore[] = [];
    for (let i = 0; i < 5; i++) {
      const eventCount = Math.floor(18 - i * 3 + Math.random() * 5);
      const changeRate = Math.floor(Math.random() * 40 - 10);
      let severity: 'high' | 'medium' | 'low' = 'low';
      if (eventCount >= 12 || changeRate >= 15) {
        severity = 'high';
      } else if (eventCount >= 8) {
        severity = 'medium';
      }
      
      stores.push({
        storeId: `store_${market}_${i}`,
        storeName: storeNames[storeIndex % storeNames.length],
        market,
        eventCount,
        changeRate,
        severity,
      });
      storeIndex++;
    }
    return { market, stores };
  });
}

export function getReviewVoices(keyword: string): ReviewVoice[] {
  const templates: Record<string, string[]> = {
    '异物': [
      '菜里面吃出了一块塑料片，太恶心了！',
      '今天吃到异物了，是一小块不明物体，影响食欲',
      '汤里发现了异物，不知道是什么东西',
      '吃到一半发现盘子里有异物，直接不想吃了',
      '菜品里有异物，要求退款商家态度还不好',
    ],
    '拉肚子': [
      '吃完之后肚子不舒服，跑了好几趟厕所',
      '晚上吃的，第二天一直拉肚子',
      '全家人都拉肚子了，怀疑食材有问题',
      '吃完不到两小时就开始肚子疼，拉了好几次',
      '应该是食物不干净，吃完就拉肚子了',
    ],
    '变质': [
      '肉闻起来有异味，应该是变质了',
      '蔬菜都蔫了，明显不新鲜已经变质',
      '酱料有股酸味，感觉已经变质了',
      '米饭吃起来怪怪的，可能放太久变质了',
      '鸡蛋散开了，应该是变质的蛋',
    ],
    '过期': [
      '检查了一下调料包，发现已经过期了',
      '饮料的生产日期太久了，都快过期了',
      '包装上的日期显示已经过期一周了',
      '牛奶明显过期了，喝起来有酸味',
      '食材看起来不新鲜，可能用了过期的原料',
    ],
    '头发': [
      '菜里吃出一根头发，太恶心了！',
      '汤面里面有一根长头发',
      '沙拉里发现了头发，直接没法吃了',
      '吃到一半发现有头发，影响心情',
      '又是头发！这家店卫生太差了',
    ],
    '虫子': [
      '青菜里有虫子，吓死我了！',
      '发现有小虫子在菜上爬',
      '蔬菜没洗干净，吃出了虫子',
      '水果里面有虫洞，明显有虫子',
      '点的菜里有虫子，店员态度还不好',
    ],
    '不新鲜': [
      '海鲜明显不新鲜，有腥臭味',
      '蔬菜都蔫了，一看就不新鲜',
      '肉质发暗，吃起来口感也不好，不新鲜',
      '水果都软了，肯定放了好几天了',
      '鱼不新鲜，眼睛都浑浊了',
    ],
    '食物中毒': [
      '吃完后上吐下泻，可能是食物中毒',
      '全家都不舒服，怀疑食物中毒',
      '吃完后发烧呕吐，去医院说是食物中毒',
      '症状很像食物中毒，已经投诉了',
      '吃完之后肠胃炎，医生说可能是食物中毒',
    ],
    '腹泻': [
      '吃完当晚就开始腹泻',
      '持续腹泻，应该是吃这家造成的',
      '腹泻了一整天，太难受了',
      '严重腹泻，不得不去医院',
      '吃完后腹泻，之前没有肠胃问题',
    ],
    '发霉': [
      '面包上有发霉的痕迹',
      '酱料打开一看发霉了',
      '水果切开后发现里面发霉了',
      '食材明显发霉了还在用',
      '馒头底部有霉斑，太可怕了',
    ],
  };
  
  const storeNames = ['朝阳门店', '西单店', '国贸店', '望京店', '中关村店', 
                      '徐汇店', '浦东店', '天河店', '海珠店', '下沙店'];
  const platforms = ['美团', '大众点评', '饿了么'];
  
  const contents = templates[keyword] || templates['异物'];
  
  return contents.map((content, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return {
      id: `review_${keyword}_${index}`,
      content,
      storeName: storeNames[index % storeNames.length],
      date: `${date.getMonth() + 1}月${date.getDate()}日`,
      platform: platforms[index % platforms.length],
      keyword,
    };
  });
}

export function getFoodSafetyAISummary(): string {
  return '本周食品安全事件呈上升趋势（环比+18%），主要集中在华东区域。高频问题：异物、拉肚子、变质。建议重点排查华东区域的后厨操作规范及食材存储条件。';
}
