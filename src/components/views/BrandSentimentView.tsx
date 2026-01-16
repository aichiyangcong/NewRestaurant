import { useState, useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { QSCVDrillDownChart } from '../charts/QSCVDrillDownChart';
import { WordCloud } from '../charts/WordCloud';
import { useDashboardStore } from '../../store/dashboardStore';
import { getStores, getReviews, generateContentAnalysisData } from '../../data/mockData';
import type { QSCVTagL1, QSCVTagL2, QSCVTagL3 } from '../../types';

export function BrandSentimentView() {
  const { openStoreDrawer } = useDashboardStore();
  const [selectedL1, setSelectedL1] = useState<string>();
  const [selectedL2, setSelectedL2] = useState<string>();
  const [selectedL3, setSelectedL3] = useState<string>();

  const contentData = useMemo(() => {
    const stores = getStores();
    const reviews = getReviews();
    return generateContentAnalysisData(stores, reviews);
  }, []);

  const { sentiment, qscvTags, positiveWordCloud, negativeWordCloud } = contentData;

  const currentL3Data = useMemo(() => {
    if (!selectedL1 || !selectedL2) return null;

    const l1Item = qscvTags.find(item => item.name === selectedL1);
    if (!l1Item) return null;

    const l2Item = l1Item.children.find(item => item.name === selectedL2);
    if (!l2Item) return null;

    return l2Item.children;
  }, [qscvTags, selectedL1, selectedL2]);

  const selectedL3Item = useMemo(() => {
    if (!currentL3Data || currentL3Data.length === 0) return null;

    if (selectedL3) {
      const l3Item = currentL3Data.find(item => item.name === selectedL3);
      return l3Item || currentL3Data[0];
    }

    return currentL3Data[0];
  }, [currentL3Data, selectedL3]);

  const handleL1Click = (name: string) => {
    if (selectedL1 === name) {
      setSelectedL1(undefined);
      setSelectedL2(undefined);
      setSelectedL3(undefined);
    } else {
      setSelectedL1(name);
      setSelectedL2(undefined);
      setSelectedL3(undefined);
    }
  };

  const handleL2Click = (l1Name: string, l2Name: string) => {
    if (selectedL2 === l2Name) {
      setSelectedL2(undefined);
      setSelectedL3(undefined);
    } else {
      setSelectedL2(l2Name);
      setSelectedL3(undefined);
    }
  };

  const handleL3Click = (l1Name: string, l2Name: string, l3Name: string) => {
    setSelectedL3(l3Name);
  };

  const handleStoreClick = (storeId: string, storeName: string) => {
    const stores = getStores();
    const reviews = getReviews();
    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    const storeReviews = reviews.filter(r => r.storeId === storeId);
    const negativeReviews = storeReviews.filter(r => r.rating < 3.0);
    const avgRating = storeReviews.length > 0
      ? storeReviews.reduce((sum, r) => sum + r.rating, 0) / storeReviews.length
      : 0;

    const tagCounts = new Map<string, number>();
    storeReviews.forEach(review => {
      review.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const positiveTagsTop3 = Array.from(tagCounts.entries())
      .filter(([tag]) => ['好吃', '美味', '新鲜', '服务好', '环境好', '干净', '实惠'].includes(tag))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    const negativeTagsTop3 = Array.from(tagCounts.entries())
      .filter(([tag]) => !['好吃', '美味', '新鲜', '服务好', '环境好', '干净', '实惠'].includes(tag))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    openStoreDrawer({
      ...store,
      totalReviews: storeReviews.length,
      avgRating: Number(avgRating.toFixed(1)),
      negativeReviews: negativeReviews.length,
      negativeRate: storeReviews.length > 0 ? (negativeReviews.length / storeReviews.length) * 100 : 0,
      replyRate: storeReviews.filter(r => r.replied).length / storeReviews.length * 100,
      recentReviews: storeReviews.slice(0, 10),
      issueDistribution: negativeTagsTop3,
      positiveTagsTop3,
      negativeTagsTop3,
    });
  };

  const handleBreadcrumbClick = (level: 'root' | 'l1' | 'l2') => {
    if (level === 'root') {
      setSelectedL1(undefined);
      setSelectedL2(undefined);
      setSelectedL3(undefined);
    } else if (level === 'l1') {
      setSelectedL2(undefined);
      setSelectedL3(undefined);
    } else if (level === 'l2') {
      setSelectedL3(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold text-gray-900">{sentiment.score}</h3>
              <span className="text-sm text-gray-500">品牌情感分</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">正面 {sentiment.positive}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">中性 {sentiment.neutral}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">负面 {sentiment.negative}%</span>
              </div>
            </div>
          </div>
          <div className="w-32 h-32">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={`${sentiment.positive * 2.51} 251`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eab308"
                strokeWidth="8"
                strokeDasharray={`${sentiment.neutral * 2.51} 251`}
                strokeDashoffset={-sentiment.positive * 2.51}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray={`${sentiment.negative * 2.51} 251`}
                strokeDashoffset={-(sentiment.positive + sentiment.neutral) * 2.51}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-blue-900 mb-1">AI 智能洞察</div>
            <p className="text-sm text-blue-800 leading-relaxed">{sentiment.aiSummary}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="col-span-2 p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button
                  onClick={() => handleBreadcrumbClick('root')}
                  className="hover:text-blue-600 transition-colors"
                >
                  全部分类
                </button>
                {selectedL1 && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => handleBreadcrumbClick('l1')}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {selectedL1}
                    </button>
                  </>
                )}
                {selectedL2 && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => handleBreadcrumbClick('l2')}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {selectedL2}
                    </button>
                  </>
                )}
              </div>
            </div>
            <QSCVDrillDownChart
              data={qscvTags}
              selectedL1={selectedL1}
              selectedL2={selectedL2}
              selectedL3={selectedL3}
              onL1Click={handleL1Click}
              onL2Click={handleL2Click}
              onL3Click={handleL3Click}
            />
          </div>

          <div className="p-6 bg-gray-50">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">问题最严重门店 Top 5</h4>
              {selectedL3Item && (
                <div className="mt-2 text-xs text-gray-500">
                  当前问题：<span className="font-medium text-red-600">{selectedL3Item.name}</span>
                </div>
              )}
            </div>
            {selectedL3Item ? (
              <div className="space-y-3">
                {selectedL3Item.topStores.map((store, index) => (
                  <button
                    key={store.storeId}
                    onClick={() => handleStoreClick(store.storeId, store.storeName)}
                    className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}. {store.storeName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      提及次数: <span className="font-semibold text-red-600">{store.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-sm">
                  {selectedL1
                    ? (selectedL2
                        ? '点击左侧条形图查看具体问题的门店排名'
                        : '请继续选择二级分类')
                    : '请选择分类查看相关数据'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">😊</div>
            <h3 className="text-lg font-semibold text-gray-900">夸夸墙</h3>
            <span className="text-sm text-gray-500">(好评关键词)</span>
          </div>
          <WordCloud data={positiveWordCloud} height={300} colorScheme="green" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">😡</div>
            <h3 className="text-lg font-semibold text-gray-900">吐槽墙</h3>
            <span className="text-sm text-gray-500">(差评关键词)</span>
          </div>
          <WordCloud data={negativeWordCloud} height={300} colorScheme="red" />
        </div>
      </div>
    </div>
  );
}
