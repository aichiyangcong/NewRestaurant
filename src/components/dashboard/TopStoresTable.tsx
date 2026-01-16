import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface StoreItem {
  market: string;
  storeId: string;
  storeName: string;
  rating: number;
  change: number;
}

interface TopStoresTableProps {
  redList: StoreItem[];
  blackList: StoreItem[];
  onStoreClick?: (storeId: string, storeName: string) => void;
}

export function TopStoresTable({ redList, blackList, onStoreClick }: TopStoresTableProps) {
  const [activeTab, setActiveTab] = useState<'red' | 'black'>('red');
  const displayList = activeTab === 'red' ? redList : blackList;

  const renderTrend = (change: number) => {
    if (change > 0) {
      return (
        <span className="flex items-center gap-0.5 text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs">+{change.toFixed(2)}</span>
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center gap-0.5 text-red-600">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs">{change.toFixed(2)}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-gray-400">
        <Minus className="w-3 h-3" />
        <span className="text-xs">0</span>
      </span>
    );
  };

  const handleRowClick = (store: StoreItem) => {
    if (onStoreClick) {
      onStoreClick(store.storeId, store.storeName);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">各市场区域Top3门店</h3>
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => setActiveTab('red')}
            className={clsx(
              'px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'red'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            红榜
          </button>
          <button
            onClick={() => setActiveTab('black')}
            className={clsx(
              'px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'black'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            黑榜
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                市场区域
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                门店ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                门店名称
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                星级
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                环比
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayList.map((store, idx) => (
              <tr 
                key={`${store.storeId}-${idx}`} 
                className={clsx(
                  'transition-colors',
                  onStoreClick && 'cursor-pointer hover:bg-blue-50'
                )}
                onClick={() => handleRowClick(store)}
              >
                <td className="py-3 px-4 text-sm text-gray-700">{store.market}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{store.storeId}</td>
                <td className="py-3 px-4 text-sm text-blue-600 font-medium hover:text-blue-700">
                  {store.storeName}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={clsx(
                    'inline-flex items-center justify-center px-2 py-0.5 rounded text-sm font-medium',
                    store.rating >= 4.5 ? 'bg-green-100 text-green-700' :
                    store.rating >= 4.0 ? 'bg-blue-100 text-blue-700' :
                    store.rating >= 3.5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {store.rating.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {renderTrend(store.change)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
