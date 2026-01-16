import { MessageSquare } from 'lucide-react';

export function ReviewToolsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">评价工具</h2>
        <p className="text-gray-500">评价管理和回复工具即将上线</p>
      </div>
    </div>
  );
}
