import { X, Star, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getReviewsByKeyword } from '../../data/regionalAnalysisData';

interface KeywordReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  region: string;
}

export function KeywordReviewDrawer({ isOpen, onClose, keyword, region }: KeywordReviewDrawerProps) {
  if (!isOpen) return null;
  
  const reviews = getReviewsByKeyword(keyword, region);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const highlightKeyword = (content: string, kw: string) => {
    const parts = content.split(new RegExp(`(${kw})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === kw.toLowerCase() ? (
        <span key={index} className="bg-red-100 text-red-700 px-0.5 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-50 to-orange-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-red-500" />
              品价原声
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              关键词「<span className="text-red-600 font-medium">{keyword}</span>」· {region}区域
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {review.channel}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {format(review.createTime, 'MM-dd HH:mm')}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {highlightKeyword(review.content, keyword)}
              </p>
              <div className="text-xs text-gray-500">
                门店：{review.storeName}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            共 {reviews.length} 条相关评价
          </p>
        </div>
      </div>
    </>
  );
}
