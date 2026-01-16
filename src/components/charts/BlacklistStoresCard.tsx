import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface BlacklistStore {
  storeId: string;
  storeName: string;
  market: string;
  eventCount: number;
  changeRate: number;
  severity: 'high' | 'medium' | 'low';
}

interface MarketBlacklist {
  market: string;
  stores: BlacklistStore[];
}

interface BlacklistStoresCardProps {
  data: MarketBlacklist[];
  onStoreClick?: (storeId: string, storeName: string) => void;
}

function getSeverityStyles(severity: 'high' | 'medium' | 'low') {
  switch (severity) {
    case 'high':
      return {
        border: 'border-red-300',
        bg: 'bg-red-50',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700',
      };
    case 'medium':
      return {
        border: 'border-orange-300',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700',
      };
    default:
      return {
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        badge: 'bg-gray-100 text-gray-600',
      };
  }
}

function StoreCard({ store, onStoreClick }: { 
  store: BlacklistStore; 
  onStoreClick?: (storeId: string, storeName: string) => void;
}) {
  const styles = getSeverityStyles(store.severity);
  const isUp = store.changeRate > 0;

  return (
    <div
      className={`p-2.5 rounded-lg border ${styles.border} ${styles.bg} cursor-pointer hover:shadow-sm transition-all`}
      onClick={() => onStoreClick?.(store.storeId, store.storeName)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {store.severity === 'high' && (
              <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${styles.text} truncate`}>
              {store.storeName}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-1.5 py-0.5 rounded ${styles.badge}`}>
              {store.eventCount} 件
            </span>
            <div className={`flex items-center gap-0.5 text-xs ${isUp ? 'text-red-500' : 'text-green-500'}`}>
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{isUp ? '+' : ''}{store.changeRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketStoreList({ marketData, onStoreClick }: { 
  marketData: MarketBlacklist; 
  onStoreClick?: (storeId: string, storeName: string) => void;
}) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{marketData.market}</h4>
      <div className="space-y-2">
        {marketData.stores.slice(0, 3).map(store => (
          <StoreCard key={store.storeId} store={store} onStoreClick={onStoreClick} />
        ))}
      </div>
    </div>
  );
}

export function BlacklistStoresCard({ data, onStoreClick }: BlacklistStoresCardProps) {
  const leftColumn = data.slice(0, Math.ceil(data.length / 2));
  const rightColumn = data.slice(Math.ceil(data.length / 2));

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">食品安全问题门店</h3>
      <p className="text-xs text-gray-400 mb-4">点击门店可查看详情</p>
      <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
        <div>
          {leftColumn.map(marketData => (
            <MarketStoreList 
              key={marketData.market} 
              marketData={marketData} 
              onStoreClick={onStoreClick}
            />
          ))}
        </div>
        <div>
          {rightColumn.map(marketData => (
            <MarketStoreList 
              key={marketData.market} 
              marketData={marketData}
              onStoreClick={onStoreClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
