import { MessageSquare } from 'lucide-react';
import { Drawer } from './Drawer';
import { useDashboardStore } from '../../store/dashboardStore';

export function ReviewDrawer() {
  const { reviewDrawerContent, showReviewDrawer, closeReviewDrawer } = useDashboardStore();

  return (
    <Drawer
      isOpen={showReviewDrawer}
      onClose={closeReviewDrawer}
      title="评价原声"
      width="max-w-2xl"
    >
      <div className="space-y-4">
        {reviewDrawerContent.length > 0 ? (
          reviewDrawerContent.map((content, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed">{content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">暂无相关评价</p>
          </div>
        )}
      </div>
    </Drawer>
  );
}
