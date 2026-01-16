import { X, MessageSquare, Store, Calendar, Globe } from 'lucide-react';

interface ReviewVoice {
  id: string;
  content: string;
  storeName: string;
  date: string;
  platform: string;
  keyword: string;
}

interface ReviewVoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  reviews: ReviewVoice[];
}

export function ReviewVoiceDrawer({ isOpen, onClose, keyword, reviews }: ReviewVoiceDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">顾客原声</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              关键词: <span className="text-orange-600 font-medium">"{keyword}"</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {review.content.split(keyword).map((part, index, arr) => (
                        <span key={index}>
                          {part}
                          {index < arr.length - 1 && (
                            <span className="bg-orange-200 text-orange-800 px-1 rounded">
                              {keyword}
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Store size={12} />
                        <span>{review.storeName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe size={12} />
                        <span>{review.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            共找到 {reviews.length} 条相关评价
          </p>
        </div>
      </div>
    </>
  );
}
