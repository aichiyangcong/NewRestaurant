import { create } from 'zustand';
import { subDays } from 'date-fns';
import type { FilterState, FilterPreset, PageType, HomeSubViewType, StoreDetail } from '../types';

interface ReviewDrillDownState {
  storeId: string;
  storeName: string;
  tagFilter?: string;
  sentiment?: 'positive' | 'negative' | 'all';
}

interface DashboardState {
  activePage: PageType;
  activeHomeSubView: HomeSubViewType;
  filters: FilterState;
  presets: FilterPreset[];
  loading: boolean;
  selectedStoreDetail: StoreDetail | null;
  showStoreDrawer: boolean;
  reviewDrawerContent: string[];
  showReviewDrawer: boolean;
  reviewDrillDownState: ReviewDrillDownState | null;
  showReviewDrillDown: boolean;

  setActivePage: (page: PageType) => void;
  setActiveHomeSubView: (view: HomeSubViewType) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  savePreset: (name: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  setLoading: (loading: boolean) => void;
  openStoreDrawer: (store: StoreDetail) => void;
  closeStoreDrawer: () => void;
  openReviewDrawer: (reviews: string[]) => void;
  closeReviewDrawer: () => void;
  openReviewDrillDown: (state: ReviewDrillDownState) => void;
  closeReviewDrillDown: () => void;
}

const defaultFilters: FilterState = {
  dateRange: {
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    label: '最近7天',
  },
  region: 'all',
  city: 'all',
  group: 'all',
  channel: 'all',
};

const getDefaultFilters = (): FilterState => ({
  dateRange: {
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    label: '最近7天',
  },
  region: 'all',
  city: 'all',
  group: 'all',
  channel: 'all',
});

export const useDashboardStore = create<DashboardState>((set) => ({
  activePage: 'home',
  activeHomeSubView: 'brandScore',
  filters: defaultFilters,
  presets: [
    {
      id: 'preset-1',
      name: '华东区最近7天',
      filters: {
        dateRange: {
          startDate: subDays(new Date(), 7),
          endDate: new Date(),
          label: '最近7天',
        },
        region: '华东',
        city: 'all',
        group: 'all',
        channel: 'all',
      },
    },
    {
      id: 'preset-2',
      name: '美团渠道最近30天',
      filters: {
        dateRange: {
          startDate: subDays(new Date(), 30),
          endDate: new Date(),
          label: '最近30天',
        },
        region: 'all',
        city: 'all',
        group: 'all',
        channel: '美团',
      },
    },
  ],
  loading: false,
  selectedStoreDetail: null,
  showStoreDrawer: false,
  reviewDrawerContent: [],
  showReviewDrawer: false,
  reviewDrillDownState: null,
  showReviewDrillDown: false,

  setActivePage: (page) => set({ activePage: page }),

  setActiveHomeSubView: (view) => set({ activeHomeSubView: view }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: getDefaultFilters() }),

  savePreset: (name) =>
    set((state) => ({
      presets: [
        ...state.presets,
        {
          id: `preset-${Date.now()}`,
          name,
          filters: state.filters,
        },
      ],
    })),

  loadPreset: (presetId) =>
    set((state) => {
      const preset = state.presets.find((p) => p.id === presetId);
      return preset ? { filters: preset.filters } : {};
    }),

  deletePreset: (presetId) =>
    set((state) => ({
      presets: state.presets.filter((p) => p.id !== presetId),
    })),

  setLoading: (loading) => set({ loading }),

  openStoreDrawer: (store) =>
    set({
      selectedStoreDetail: store,
      showStoreDrawer: true,
    }),

  closeStoreDrawer: () =>
    set({
      selectedStoreDetail: null,
      showStoreDrawer: false,
    }),

  openReviewDrawer: (reviews) =>
    set({
      reviewDrawerContent: reviews,
      showReviewDrawer: true,
    }),

  closeReviewDrawer: () =>
    set({
      reviewDrawerContent: [],
      showReviewDrawer: false,
    }),

  openReviewDrillDown: (state) =>
    set({
      reviewDrillDownState: state,
      showReviewDrillDown: true,
    }),

  closeReviewDrillDown: () =>
    set({
      reviewDrillDownState: null,
      showReviewDrillDown: false,
    }),
}));
