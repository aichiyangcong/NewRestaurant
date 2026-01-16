import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">设置</h2>
        <p className="text-gray-500">系统设置功能即将上线</p>
      </div>
    </div>
  );
}
