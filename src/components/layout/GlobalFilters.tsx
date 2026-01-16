import { Calendar, MapPin, Smartphone, Search, RotateCcw } from 'lucide-react';
import { subDays, subMonths, format, parseISO } from 'date-fns';
import { useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { REGIONS, CITIES_BY_REGION, GROUPS_BY_CITY, CHANNELS } from '../../data/constants';
import { FilterPresets } from '../common/FilterPresets';
import type { DateRange, City, Group } from '../../types';

const DATE_PRESETS: DateRange[] = [
  { startDate: subDays(new Date(), 7), endDate: new Date(), label: '最近7天' },
  { startDate: subDays(new Date(), 30), endDate: new Date(), label: '最近30天' },
  { startDate: subMonths(new Date(), 3), endDate: new Date(), label: '最近3个月' },
];

export function GlobalFilters() {
  const { filters, setFilters, resetFilters } = useDashboardStore();
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(format(filters.dateRange.startDate, 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState(format(filters.dateRange.endDate, 'yyyy-MM-dd'));

  const handleDateRangeChange = (range: DateRange) => {
    setFilters({ dateRange: range });
    setShowCustomDate(false);
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      const startDate = parseISO(customStartDate);
      const endDate = parseISO(customEndDate);
      setFilters({
        dateRange: {
          startDate,
          endDate,
          label: `${format(startDate, 'MM/dd')}-${format(endDate, 'MM/dd')}`,
        },
      });
      setShowCustomDate(false);
    }
  };

  const handleRegionChange = (region: string) => {
    setFilters({
      region: region === 'all' ? 'all' : (region as any),
      city: 'all',
      group: 'all',
    });
  };

  const handleCityChange = (city: string) => {
    setFilters({
      city: city === 'all' ? 'all' : (city as City),
      group: 'all',
    });
  };

  const handleGroupChange = (group: string) => {
    setFilters({ group: group === 'all' ? 'all' : (group as Group) });
  };

  const handleChannelChange = (channel: string) => {
    setFilters({ channel: channel === 'all' ? 'all' : (channel as any) });
  };

  const handleQuery = () => {
    console.log('执行查询:', filters);
  };

  const handleReset = () => {
    resetFilters();
    setCustomStartDate(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    setCustomEndDate(format(new Date(), 'yyyy-MM-dd'));
    setShowCustomDate(false);
  };

  const availableCities: City[] =
    filters.region === 'all'
      ? Object.values(CITIES_BY_REGION).flat()
      : CITIES_BY_REGION[filters.region];

  const availableGroups: Group[] =
    filters.city === 'all'
      ? []
      : GROUPS_BY_CITY[filters.city] || [];

  const isPresetActive = (preset: DateRange) => {
    return filters.dateRange.label === preset.label;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">日期范围:</span>
            <div className="flex gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleDateRangeChange(preset)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isPresetActive(preset)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={() => setShowCustomDate(!showCustomDate)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showCustomDate || !DATE_PRESETS.some(isPresetActive)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                自定义
              </button>
            </div>
          </div>

          {showCustomDate && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleCustomDateApply}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                应用
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">区域:</span>
            <select
              value={filters.region}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部区域</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部城市</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={filters.group}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={filters.city === 'all'}
            >
              <option value="all">全部组</option>
              {availableGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">渠道:</span>
            <select
              value={filters.channel}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部渠道</option>
              {CHANNELS.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleQuery}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              查询
            </button>
            <FilterPresets />
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
