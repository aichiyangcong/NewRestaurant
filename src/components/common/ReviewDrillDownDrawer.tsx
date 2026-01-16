import { useState, useMemo } from 'react';
import { X, ArrowLeft, Search, Copy, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Review } from '../../types';

interface ReviewDrillDownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  storeName: string;
  tagFilter?: string;
  sentiment?: 'positive' | 'negative' | 'all';
  reviews: Review[];
}

type SortOption = 'time_desc' | 'time_asc' | 'rating_desc' | 'rating_asc';

const TAG_KEYWORDS_MAP: Record<string, string[]> = {
  '出餐速度': ['慢', '久', '等', '没上菜', '没送出', '分钟', '小时', '催'],
  '出餐慢': ['慢', '久', '等', '没上菜', '没送出', '分钟', '小时', '催'],
  '食品安全': ['变质', '异物', '过期', '馊', '坏', '发霉', '不新鲜', '脏', '头发', '虫'],
  '脏': ['脏', '不干净', '卫生'],
  '难吃': ['难吃', '不好吃'],
  '口味': ['难吃', '不好吃', '太咸', '太甜', '太辣', '没味道', '怪味', '腥'],
  '服务': ['态度', '差', '凶', '不理', '没礼貌', '骂', '冷漠'],
  '服务好': ['服务', '态度', '热情', '礼貌', '周到'],
  '份量': ['少', '小份', '缩水', '不值', '量少'],
  '环境': ['脏', '乱', '差', '臭', '吵', '破'],
  '价格': ['贵', '涨价', '不值', '性价比'],
  '优秀': ['好', '优秀', '赞', '不错'],
  '推荐': ['推荐', '值得', '满意'],
};

export default function ReviewDrillDownDrawer({
  isOpen,
  onClose,
  storeId,
  storeName,
  tagFilter,
  sentiment = 'all',
  reviews,
}: ReviewDrillDownDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('time_desc');

  const keywords = useMemo(() => {
    if (!tagFilter) return [];
    return TAG_KEYWORDS_MAP[tagFilter] || [];
  }, [tagFilter]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(r => r.storeId === storeId);

    if (sentiment !== 'all') {
      filtered = filtered.filter(r =>
        sentiment === 'positive' ? r.rating >= 4 : r.rating < 4
      );
    }

    if (tagFilter && keywords.length > 0) {
      filtered = filtered.filter(review =>
        keywords.some(keyword => review.content.includes(keyword)) ||
        review.tags.some(tag => tag.includes(tagFilter))
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time_desc':
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        case 'time_asc':
          return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, storeId, sentiment, tagFilter, keywords, searchQuery, sortBy]);

  const highlightKeywords = (text: string) => {
    if (!keywords.length) return text;

    let result = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(regex, '<mark class="bg-red-200 text-red-900 font-semibold px-0.5">$1</mark>');
    });
    return result;
  };

  const getReplyDelay = (reviewDate: Date, replyDate?: Date) => {
    if (!replyDate) return null;
    const delay = Math.floor(
      (replyDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60)
    );
    if (delay < 1) return '不到1小时';
    if (delay < 24) return `${delay}小时`;
    return `${Math.floor(delay / 24)}天`;
  };

  const handleCopyToManager = (review: Review) => {
    const text = `【${storeName}】差评预警\n时间: ${format(review.createTime, 'yyyy-MM-dd HH:mm')}\n评分: ${review.rating}星\n渠道: ${review.channel}\n内容: ${review.content}\n标签: ${review.tags?.join(' ')}`;
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板，可发送给店长');
  };

  if (!isOpen) return null;

  const sentimentText =
    sentiment === 'negative' ? '差评' : sentiment === 'positive' ? '好评' : '全部评价';
  const tagCount = filteredReviews.length;
  const keywordHint = keywords.length > 0 ? keywords.slice(0, 5).map(k => `"${k}"`).join('、') : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {sentimentText}原声穿透 - {storeName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {tagFilter && (
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-gray-900">
                当前聚焦标签：
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                🔴 #{tagFilter}
              </span>
              <span className="text-red-600 font-medium">({tagCount}条)</span>
            </div>
            {keywordHint && (
              <p className="text-sm text-gray-600">
                以下评价均包含 {keywordHint} 等语义关键词
              </p>
            )}
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索评价内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="time_desc">时间倒序</option>
            <option value="time_asc">时间正序</option>
            <option value="rating_desc">评分从高到低</option>
            <option value="rating_asc">评分从低到高</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无匹配的评价数据
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.id.substring(0, 12)}</span>
                      <span className="text-sm text-gray-500">
                        ({review.channel})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500">
                        {'⭐'.repeat(Math.floor(review.rating))}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(review.createTime, 'yyyy-MM-dd HH:mm')}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mb-3">
                  <p
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(review.content) }}
                  />
                </div>

                {review.tags && review.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">关联标签:</span>
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {review.replied && review.replyContent && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-900">商家回复</span>
                      {review.replyTime && (
                        <span className="text-xs text-blue-700">
                          耗时 {getReplyDelay(review.createTime, review.replyTime)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-800">{review.replyContent}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleCopyToManager(review)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    复制发给店长
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    申诉剔除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            共找到 <span className="font-semibold text-gray-900">{filteredReviews.length}</span> 条评价
          </div>
        </div>
      </div>
    </div>
  );
}
