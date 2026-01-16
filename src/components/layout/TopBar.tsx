import { Bell, Settings, User } from 'lucide-react';

export function TopBar() {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">评价洞察专家</h2>
        <p className="text-xs text-gray-500">连锁餐饮评价分析平台</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2 pl-4 border-l">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">管理员</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
