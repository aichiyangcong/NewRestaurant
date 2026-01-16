import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';

export function FilterPresets() {
  const { presets, loadPreset, savePreset, deletePreset } = useDashboardStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (presetName.trim()) {
      savePreset(presetName);
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSaveDialog(!showSaveDialog)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save className="w-4 h-4" />
        保存为预设
      </button>

      {showSaveDialog && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
          <h3 className="text-sm font-medium text-gray-900 mb-3">保存筛选预设</h3>

          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="输入预设名称"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setPresetName('');
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
          </div>

          {presets.length > 0 && (
            <>
              <div className="border-t pt-3 mb-2">
                <h4 className="text-xs font-medium text-gray-600 mb-2">已保存的预设</h4>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <button
                      onClick={() => {
                        loadPreset(preset.id);
                        setShowSaveDialog(false);
                      }}
                      className="flex-1 text-left text-sm text-gray-700 hover:text-blue-600"
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
