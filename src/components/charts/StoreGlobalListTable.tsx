import { Eye, Star } from 'lucide-react';
import type { StoreListItem } from '../../data/storeAnalysisData';

interface StoreGlobalListTableProps {
  data: StoreListItem[];
  onViewDetails: (storeId: string) => void;
}

export function StoreGlobalListTable({ data, onViewDetails }: StoreGlobalListTableProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReplyRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-blue-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNegativeCountColor = (count: number) => {
    if (count <= 3) return 'text-green-600';
    if (count <= 8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-600">区域</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">门店</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">督导</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">星级</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">差评数</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">24小时回复率</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((store, index) => (
            <tr
              key={store.id}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                  {store.region}
                </span>
              </td>
              <td className="py-3 px-4 font-medium text-gray-900">{store.storeName}</td>
              <td className="py-3 px-4 text-gray-600">{store.supervisor}</td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-flex items-center gap-1 font-medium ${getRatingColor(store.rating)}`}>
                  <Star className="w-3 h-3 fill-current" />
                  {store.rating}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`font-medium ${getNegativeCountColor(store.negativeCount)}`}>
                  {store.negativeCount}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`font-medium ${getReplyRateColor(store.replyRate24h)}`}>
                  {store.replyRate24h}%
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onViewDetails(store.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  查看详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无门店数据
        </div>
      )}
    </div>
  );
}
