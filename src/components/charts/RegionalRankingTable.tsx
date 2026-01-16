import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Minus, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { 
  getRegionRankings, 
  getSupervisorGroupRankings, 
  getSupervisorRankings,
  getStoreRankingsBySupervisor,
  type RegionRankingItem,
  type SupervisorGroupRankingItem,
  type SupervisorRankingItem,
  type StoreRankingItem,
} from '../../data/regionalAnalysisData';
import { useDashboardStore } from '../../store/dashboardStore';

type DrillLevel = 'region' | 'group' | 'supervisor' | 'store';

interface BreadcrumbItem {
  level: DrillLevel;
  label: string;
  region?: string;
  group?: string;
  supervisor?: string;
}

export function RegionalRankingTable() {
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('region');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);

  const { openStoreDrawer } = useDashboardStore();

  const regionData = useMemo(() => getRegionRankings(), []);
  const groupData = useMemo(() => 
    selectedRegion ? getSupervisorGroupRankings(selectedRegion) : [],
    [selectedRegion]
  );
  const supervisorData = useMemo(() => 
    selectedRegion && selectedGroup ? getSupervisorRankings(selectedRegion, selectedGroup) : [],
    [selectedRegion, selectedGroup]
  );
  const storeData = useMemo(() => 
    selectedRegion && selectedGroup && selectedSupervisor 
      ? getStoreRankingsBySupervisor(selectedRegion, selectedGroup, selectedSupervisor) 
      : [],
    [selectedRegion, selectedGroup, selectedSupervisor]
  );

  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [{ level: 'region', label: '全国区域' }];
    if (selectedRegion) {
      items.push({ level: 'group', label: selectedRegion, region: selectedRegion });
    }
    if (selectedGroup) {
      items.push({ level: 'supervisor', label: selectedGroup, region: selectedRegion!, group: selectedGroup });
    }
    if (selectedSupervisor) {
      items.push({ level: 'store', label: selectedSupervisor, region: selectedRegion!, group: selectedGroup!, supervisor: selectedSupervisor });
    }
    return items;
  }, [selectedRegion, selectedGroup, selectedSupervisor]);

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.level === 'region') {
      setDrillLevel('region');
      setSelectedRegion(null);
      setSelectedGroup(null);
      setSelectedSupervisor(null);
    } else if (item.level === 'group') {
      setDrillLevel('group');
      setSelectedGroup(null);
      setSelectedSupervisor(null);
    } else if (item.level === 'supervisor') {
      setDrillLevel('supervisor');
      setSelectedSupervisor(null);
    }
  };

  const handleRegionClick = (region: RegionRankingItem) => {
    setSelectedRegion(region.name);
    setSelectedGroup(null);
    setSelectedSupervisor(null);
    setDrillLevel('group');
  };

  const handleGroupClick = (group: SupervisorGroupRankingItem) => {
    setSelectedGroup(group.name);
    setSelectedSupervisor(null);
    setDrillLevel('supervisor');
  };

  const handleSupervisorClick = (supervisor: SupervisorRankingItem) => {
    setSelectedSupervisor(supervisor.name);
    setDrillLevel('store');
  };

  const handleStoreClick = (store: StoreRankingItem) => {
    const totalReviews = 800 + Math.floor(Math.random() * 600);
    openStoreDrawer({
      id: store.id,
      name: store.name,
      region: store.region as '华东' | '华北' | '华南' | '华中' | '西南' | '东北',
      province: '上海' as const,
      address: `${store.region}某商业街道123号`,
      openDate: new Date(2022, Math.floor(Math.random() * 12), 1),
      totalReviews,
      avgRating: store.avgRating,
      negativeReviews: store.negativeCount,
      negativeRate: store.negativePerTenThousand * 10,
      replyRate: 92 + Math.floor(Math.random() * 8),
      recentReviews: [
        {
          id: 'r1',
          storeId: store.id,
          storeName: store.name,
          rating: 5,
          content: '味道很不错，环境也很好，服务员态度热情，下次还会来！',
          channel: '美团',
          createTime: new Date(),
          replied: true,
          replyContent: '感谢您的认可，期待下次光临！',
          tags: ['服务好', '环境好'],
        },
        {
          id: 'r2',
          storeId: store.id,
          storeName: store.name,
          rating: 2,
          content: '上菜太慢了，等了40分钟才上齐，影响用餐体验。',
          channel: '大众点评',
          createTime: new Date(Date.now() - 86400000),
          replied: true,
          replyContent: '非常抱歉给您带来不好的体验，我们会加强出餐效率。',
          tags: ['上菜慢', '服务差'],
        },
      ],
      issueDistribution: [
        { name: '服务问题', value: 35, percentage: 35 },
        { name: '口味问题', value: 28, percentage: 28 },
        { name: '环境问题', value: 22, percentage: 22 },
        { name: '价格问题', value: 15, percentage: 15 },
      ],
      positiveTagsTop3: [
        { name: '服务热情', value: 156 },
        { name: '口味好', value: 142 },
        { name: '环境整洁', value: 98 },
      ],
      negativeTagsTop3: [
        { name: '上菜慢', value: 23 },
        { name: '价格贵', value: 18 },
        { name: '分量少', value: 12 },
      ],
    });
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-600">
          <ChevronUp className="w-4 h-4" />
          <span className="text-xs">{change}</span>
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-500">
          <ChevronDown className="w-4 h-4" />
          <span className="text-xs">{Math.abs(change)}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center text-gray-400">
        <Minus className="w-4 h-4" />
      </span>
    );
  };

  const renderRegionTable = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">全国排名</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">区域</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">排名变化</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">万元差评次数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">差评数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">门店数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">操作</th>
        </tr>
      </thead>
      <tbody>
        {regionData.map((item, index) => (
          <tr
            key={item.id}
            onClick={() => handleRegionClick(item)}
            className="border-b border-gray-100 transition-colors cursor-pointer hover:bg-blue-50"
          >
            <td className="py-3 px-4">
              <span className={clsx(
                'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                index < 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              )}>
                {item.nationalRank}
              </span>
            </td>
            <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
            <td className="py-3 px-4 flex justify-center">{getRankChangeIcon(item.rankChange)}</td>
            <td className="py-3 px-4 text-sm text-center">
              <span className={clsx(
                item.negativePerTenThousand > 1.1 ? 'text-red-500 font-medium' : 'text-gray-900'
              )}>
                {item.negativePerTenThousand.toFixed(2)}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.negativeCount}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.storeCount}</td>
            <td className="py-3 px-4 text-center">
              <span className="text-blue-500 text-sm flex items-center justify-center gap-1">
                查看详情 <ChevronRight className="w-4 h-4" />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderGroupTable = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">区域排名</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">督导组</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">全国排名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">排名变化</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">万元差评次数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">差评数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">督导数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">操作</th>
        </tr>
      </thead>
      <tbody>
        {groupData.map((item, index) => (
          <tr
            key={item.id}
            onClick={() => handleGroupClick(item)}
            className="border-b border-gray-100 transition-colors cursor-pointer hover:bg-blue-50"
          >
            <td className="py-3 px-4">
              <span className={clsx(
                'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                index < 3 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              )}>
                {item.regionalRank}
              </span>
            </td>
            <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-600">{item.nationalRank}</td>
            <td className="py-3 px-4 flex justify-center">{getRankChangeIcon(item.rankChange)}</td>
            <td className="py-3 px-4 text-sm text-center">
              <span className={clsx(
                item.negativePerTenThousand > 1.0 ? 'text-red-500 font-medium' : 'text-gray-900'
              )}>
                {item.negativePerTenThousand.toFixed(2)}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.negativeCount}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.supervisorCount}</td>
            <td className="py-3 px-4 text-center">
              <span className="text-blue-500 text-sm flex items-center justify-center gap-1">
                查看督导 <ChevronRight className="w-4 h-4" />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSupervisorTable = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">组内排名</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">督导姓名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">区域排名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">全国排名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">排名变化</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">万元差评次数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">差评数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">门店数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">操作</th>
        </tr>
      </thead>
      <tbody>
        {supervisorData.map((item, index) => (
          <tr
            key={item.id}
            onClick={() => handleSupervisorClick(item)}
            className="border-b border-gray-100 transition-colors cursor-pointer hover:bg-blue-50"
          >
            <td className="py-3 px-4">
              <span className={clsx(
                'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                index < 3 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
              )}>
                {item.groupRank}
              </span>
            </td>
            <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-600">{item.regionalRank}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-600">{item.nationalRank}</td>
            <td className="py-3 px-4 flex justify-center">{getRankChangeIcon(item.rankChange)}</td>
            <td className="py-3 px-4 text-sm text-center">
              <span className={clsx(
                item.negativePerTenThousand > 1.0 ? 'text-red-500 font-medium' : 'text-gray-900'
              )}>
                {item.negativePerTenThousand.toFixed(2)}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.negativeCount}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.storeCount}</td>
            <td className="py-3 px-4 text-center">
              <span className="text-blue-500 text-sm flex items-center justify-center gap-1">
                查看门店 <ChevronRight className="w-4 h-4" />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderStoreTable = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">督导内排名</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">门店名称</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">组内排名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">区域排名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">全国排名</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">排名变化</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">万元差评次数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">差评数</th>
          <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">平均星级</th>
        </tr>
      </thead>
      <tbody>
        {storeData.map((item, index) => (
          <tr
            key={item.id}
            onClick={() => handleStoreClick(item)}
            className="border-b border-gray-100 transition-colors cursor-pointer hover:bg-blue-50"
          >
            <td className="py-3 px-4">
              <span className={clsx(
                'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                index < 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
              )}>
                {item.supervisorRank}
              </span>
            </td>
            <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-600">{item.groupRank}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-600">{item.regionalRank}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-600">{item.nationalRank}</td>
            <td className="py-3 px-4 flex justify-center">{getRankChangeIcon(item.rankChange)}</td>
            <td className="py-3 px-4 text-sm text-center">
              <span className={clsx(
                item.negativePerTenThousand > 1.0 ? 'text-red-500 font-medium' : 'text-gray-900'
              )}>
                {item.negativePerTenThousand.toFixed(2)}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.negativeCount}</td>
            <td className="py-3 px-4 text-sm text-center text-gray-900">{item.avgRating.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const getDataLength = () => {
    switch (drillLevel) {
      case 'region': return regionData.length;
      case 'group': return groupData.length;
      case 'supervisor': return supervisorData.length;
      case 'store': return storeData.length;
      default: return 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">区域排名</h3>
        <p className="text-sm text-gray-500">按万元差评次数排名</p>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={item.level} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
            <button
              onClick={() => handleBreadcrumbClick(item)}
              className={clsx(
                'px-2 py-1 rounded transition-colors',
                index === breadcrumbs.length - 1
                  ? 'text-blue-600 font-medium bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              )}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        {drillLevel === 'region' && renderRegionTable()}
        {drillLevel === 'group' && renderGroupTable()}
        {drillLevel === 'supervisor' && renderSupervisorTable()}
        {drillLevel === 'store' && renderStoreTable()}
      </div>

      <div className="mt-4 pt-4 border-t">
        <span className="text-sm text-gray-500">
          共 {getDataLength()} 条记录
        </span>
      </div>
    </div>
  );
}
