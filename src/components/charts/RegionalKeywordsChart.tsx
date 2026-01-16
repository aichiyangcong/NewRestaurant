interface KeywordData {
  keyword: string;
  count: number;
}

interface MarketKeywords {
  market: string;
  keywords: KeywordData[];
}

interface RegionalKeywordsChartProps {
  data: MarketKeywords[];
  onKeywordClick?: (keyword: string, market: string) => void;
}

const MARKET_COLORS: Record<string, string> = {
  '东北市场': '#3b82f6',
  '华南市场': '#10b981',
  '华中市场': '#f59e0b',
  '京津市场': '#ef4444',
  '山东市场': '#8b5cf6',
  '上海市场': '#ec4899',
  '苏皖市场': '#06b6d4',
  '西南市场': '#84cc16',
  '浙江市场': '#f97316',
};

function MarketKeywordBar({ marketData, onKeywordClick }: { 
  marketData: MarketKeywords; 
  onKeywordClick?: (keyword: string, market: string) => void;
}) {
  const maxCount = Math.max(...marketData.keywords.map(k => k.count));
  const color = MARKET_COLORS[marketData.market] || '#6b7280';

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{marketData.market}</h4>
      <div className="space-y-1.5">
        {marketData.keywords.map((kw, index) => (
          <div 
            key={kw.keyword}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 transition-colors"
            onClick={() => onKeywordClick?.(kw.keyword, marketData.market)}
          >
            <span className="text-xs text-gray-500 w-4">{index + 1}</span>
            <span className="text-xs text-gray-700 w-16 truncate">{kw.keyword}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-300"
                style={{
                  width: `${(kw.count / maxCount) * 100}%`,
                  backgroundColor: color,
                  opacity: 1 - index * 0.12,
                }}
              />
            </div>
            <span className="text-xs text-gray-600 w-8 text-right">{kw.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegionalKeywordsChart({ data, onKeywordClick }: RegionalKeywordsChartProps) {
  const leftColumn = data.slice(0, Math.ceil(data.length / 2));
  const rightColumn = data.slice(Math.ceil(data.length / 2));

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">分区域食品安全关键词 Top 5</h3>
      <p className="text-xs text-gray-400 mb-4">点击关键词可查看相关评价原声</p>
      <div className="grid grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2">
        <div>
          {leftColumn.map(marketData => (
            <MarketKeywordBar 
              key={marketData.market} 
              marketData={marketData} 
              onKeywordClick={onKeywordClick}
            />
          ))}
        </div>
        <div>
          {rightColumn.map(marketData => (
            <MarketKeywordBar 
              key={marketData.market} 
              marketData={marketData}
              onKeywordClick={onKeywordClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
