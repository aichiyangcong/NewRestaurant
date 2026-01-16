import { Home, Store, FileText, MessageSquare, Settings, AlertTriangle, MapPin } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import type { PageType } from '../../types';
import clsx from 'clsx';

const menuItems = [
  { id: 'home' as PageType, label: '首页', icon: Home },
  { id: 'regionalAnalysis' as PageType, label: '区域分析', icon: MapPin },
  { id: 'storeAnalysis' as PageType, label: '门店分析', icon: Store },
  { id: 'contentAnalysis' as PageType, label: '内容分析', icon: FileText },
  { id: 'reviewTools' as PageType, label: '评价工具', icon: MessageSquare },
  { id: 'settings' as PageType, label: '设置', icon: Settings },
];

export function Sidebar() {
  const { activePage, setActivePage } = useDashboardStore();

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">评价专家</h1>
            <p className="text-xs text-gray-500">Review Expert</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className={clsx('w-5 h-5', isActive && 'text-blue-600')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
