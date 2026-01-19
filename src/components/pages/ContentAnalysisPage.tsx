import { useState } from 'react';
import { Sparkles, Shield, Package } from 'lucide-react';
import { GlobalFilters } from '../layout/GlobalFilters';
import { BrandSentimentView } from '../views/BrandSentimentView';
import { FoodSafetyView } from '../views/FoodSafetyView';

type ContentTab = 'brandSentiment' | 'foodSafety' | 'productMatrix';

const tabs: Array<{ id: ContentTab; label: string; icon: any; description: string }> = [
  { id: 'brandSentiment', label: '品牌口碑洞察', icon: Sparkles, description: '面向运营总监/老板' },
  { id: 'foodSafety', label: '食安风险雷达', icon: Shield, description: '面向品控/督导' },
  { id: 'productMatrix', label: '菜品优化矩阵', icon: Package, description: '面向研发/供应链' },
];

export function ContentAnalysisPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('brandSentiment');

  return (
    <div className="space-y-6">
      <GlobalFilters />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative px-6 py-4 flex items-center gap-3 border-b-2 transition-all
                    ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'brandSentiment' && <BrandSentimentView />}
        {activeTab === 'foodSafety' && <FoodSafetyView />}
        {activeTab === 'productMatrix' && (
          <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">菜品优化矩阵</h3>
              <p className="text-gray-500">功能开发中，敬请期待</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
