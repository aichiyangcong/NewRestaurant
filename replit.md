# replit.md

## Overview

This is a **Chain Restaurant Review Analytics Dashboard** (评价专家连锁版本) - a comprehensive analytics platform for monitoring and analyzing customer reviews across multiple restaurant chain locations. The application provides brand reputation monitoring, food safety risk detection, store performance analysis, and review management tools for restaurant chain operators.

Key capabilities:
- Real-time monitoring of 300+ store locations
- Brand score and sentiment analysis
- Negative review rate tracking
- Food safety risk event detection
- Reply rate analytics
- QSCV (Quality, Service, Cleanliness, Value) attribution analysis
- Store-level drill-down with detailed metrics

## Recent Changes

**January 2026:**
- **Store Analysis Page (门店分析) - Redesign:**
  - AIInsightCard at top with store performance summary
  - 6 KPI metric cards in a single row (grid-cols-6):
    - Group 1: 门店平均评分, 风险门店数, 优势门店数 → RatingDistributionStackedChart
    - Group 2: 新增评分数量, 差评率 → StoreHealthBubbleChart (X=avgRating, Y=negativeRate)
    - Group 3: 24小时平均回复率 → StoreExecutionScatterChart (X=avgRating, Y=replyRate)
  - Cards are clickable to switch between 3 view groups
  - Active group cards highlighted, non-active cards dimmed (opacity 0.5)
  - Global store list table at bottom (fixed, doesn't change with view):
    - Columns: 区域, 门店, 督导, 星级, 差评数, 24小时回复率, 操作
    - Click "查看详情" opens StoreDetailDrawer
  - New data file: storeAnalysisData.ts with metrics, charts data, and getStoreDetailById
  - New chart components: StoreHealthBubbleChart, StoreExecutionScatterChart, StoreGlobalListTable
- **Regional Analysis Page (区域分析):**
  - New navigation entry in Sidebar (positioned between 首页 and 门店分析)
  - GlobalFilters integration for date/region/city/group filtering
  - AI Insight Card with regional performance summary
  - Overall Performance section:
    - 4 metric cards (门店数, 平均星级, 总营业收入, 总评价数)
    - RatingDistributionStackedChart: Grouped stacked bar showing monthly star rating distribution
  - Negative Analysis section:
    - Left: NegativeAnalysisTrendChart with Tab toggle (差评数/差评率/万元差评次数) + multi-line chart showing monthly trends by region
    - Right: QSCVTrendChart with region Tab toggle (华东/华北/华南/华中/西南/东北) + multi-line chart showing Q/S/C/V tag trends for selected region, click to drill-down into L2 sub-tags
  - Negative Keyword Analysis section:
    - Region Tab toggle (华东/华北/华南/华中/西南/东北)
    - Word cloud showing Top 10 negative keywords for selected region
    - Click keyword to open KeywordReviewDrawer with related reviews
  - Regional Ranking section:
    - Four-level drill-down: Region → Supervisor Group → Supervisor (person) → Store
    - Breadcrumb navigation for easy navigation back
    - L1 (Region): Shows 6 regions ranked by 万元差评次数 with national rank, rank change, negative count, store count
    - L2 (Supervisor Group): Shows groups within selected region with regional/national rank, supervisor count
    - L3 (Supervisor): Shows supervisors within selected group with group/regional/national rank, store count
    - L4 (Store): Shows stores managed by selected supervisor with supervisor/group/regional/national rank
    - Click store row opens StoreDetailDrawer with detailed metrics
  - regionalAnalysisData.ts with dedicated mock data functions
- **Food Safety Monitoring View (食安风险监测):**
  - FoodSafetyView with comprehensive layout:
    - FoodSafetyTrendChart: Line chart with day/month toggle and period-over-period comparison badge
    - Top 10 Keywords WordCloud: Clickable word cloud for food safety keywords
    - MarketFoodSafetyTrendChart: Multi-line chart for market trends with day/week toggle
    - RegionalKeywordsChart: Horizontal bar charts showing Top 5 keywords per market region
    - BlacklistStoresCard: Problem store cards with severity colors (red/orange/gray)
  - ReviewVoiceDrawer: Slide-out drawer showing customer reviews when keywords are clicked
  - foodSafetyData.ts with dedicated mock data for all food safety analytics
  - MARKETS constant added to constants.ts for consistent market data
- **Negative Rate Attribution Analysis View (差评率归因分析):**
  - MetricCard updated with isDimmed state (opacity 0.5 for non-active cards)
  - NegativeRateView with redesigned flat layout (no tabs, no AI card - AI insights shown in global header):
    - ReviewTrendBarChart: Grouped bar chart with day/week/month granularity toggle
    - MarketDistributionChart: Horizontal stacked bar with sort toggle (按好评/按差评排序)
    - MarketPositiveTrendChart: Multi-line chart for positive review trends by market with day/week toggle
    - MarketNegativeTrendChart2: Multi-line chart for negative review trends by market with day/week toggle
    - DimensionAnalysisChart: Bidirectional bar chart with L1→L2→L3 drill-down and breadcrumb navigation
    - NegativeWordCloud: Interactive word cloud with click-to-navigate
  - negativeRateData.ts with dedicated mock data functions including getReviewTrendData with granularity support
  - Store click integration from drill-down tables to StoreDetailDrawer
- **Homepage Redesign (PRD-compliant):**
  - Added AI Insight Card with smart summary and "查看详情" button
  - Implemented 5 metric cards with white background + colored left border (综合评分, 评价数量, 差评率, 食安风险, 回复率)
  - Active card state: light blue background + blue text while preserving left accent color
  - Non-active cards show dimmed state (opacity 0.5) when another card is selected
  - Created RatingTrendChart (multi-line chart for 总评分/美团/大众点评)
  - Created StoreRatingDistributionChart (stacked bar by rating segments)
  - Created MarketTrendChart (multi-line ECharts with benchmark line, expandable)
  - Created TopStoresTable (red/black list with change indicators)
  - Added OverviewView as the default homepage subview
  - Created homePageData.ts for dedicated homepage mock data
  - Created prd.md with full product requirements documentation
- Refactored GlobalFilters component with:
  - Custom date picker alongside quick filter presets (7天, 30天, 3个月)
  - Three-level region selection (Region → City → Group)
  - New button layout: Query (primary), Save as Preset, Reset
- Updated data structure from Province-based to City/Group-based hierarchy
- Added resetFilters functionality to restore default filter state

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Setup:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server (configured on port 5000, host 0.0.0.0)
- TailwindCSS for utility-first styling with PostCSS/Autoprefixer

**State Management:**
- Zustand for global state management (`src/store/dashboardStore.ts`)
- Centralized store handling: page navigation, filters, loading states, drawer visibility, and drill-down states

**Component Organization:**
- `components/layout/` - Core layout components (Sidebar, TopBar, GlobalFilters)
- `components/pages/` - Top-level page components (HomePage, StoreAnalysisPage, ContentAnalysisPage, etc.)
- `components/views/` - Feature-specific view components (BrandScoreView, NegativeRateView, FoodSafetyView, ReplyRateView)
- `components/charts/` - Reusable chart components using ECharts
- `components/common/` - Shared UI components (Drawer, LoadingSkeleton, FilterPresets)
- `components/dashboard/` - Dashboard-specific components (KPICard, KPICards)

**Data Visualization:**
- ECharts via `echarts-for-react` for all charts
- `echarts-wordcloud` for word cloud visualizations
- Chart types: line trends, bar distributions, bubble scatter plots, stacked bars, word clouds, QSCV drill-down charts

**Routing:**
- No router library - uses internal state-based navigation via `activePage` in Zustand store
- Pages: home, storeAnalysis, contentAnalysis, reviewTools, settings

### Data Layer

**Mock Data System:**
- `src/data/mockData.ts` - Generates realistic mock data for stores, reviews, and metrics
- `src/data/constants.ts` - Static configuration (regions, cities, groups, channels, risk categories)
- Data includes hierarchical geography (Region → City → Group) and multi-channel support (美团, 饿了么, 大众点评)

**Data Processing:**
- `src/utils/dataProcessor.ts` - Utility functions for filtering, aggregating, and transforming review data
- Supports complex filtering by date range, region, city, group, and channel
- Calculates KPIs, trends, distributions, bubble chart data, word clouds, and store details

**Type System:**
- `src/types/index.ts` - Comprehensive TypeScript type definitions
- Includes types for: Store, Review, FilterState, KPIData, TrendDataPoint, QSCV tag hierarchies

### Key Design Patterns

1. **Filter-First Architecture:** All views react to a global filter state, ensuring consistent data slicing across the application

2. **Drawer Pattern:** Uses slide-out drawers for detail views (StoreDetailDrawer, ReviewDrawer, ReviewDrillDownDrawer) to maintain context

3. **KPI-Driven Navigation:** HomePage KPI cards are clickable, switching between sub-views (brandScore, negativeRate, foodSafety, replyRate)

4. **Hierarchical Drill-Down:** QSCV analysis supports 3-level drill-down (L1 → L2 → L3 tags) with breadcrumb navigation

5. **Loading States:** Skeleton loaders provide visual feedback during data transitions

## External Dependencies

### NPM Packages

**Core:**
- `react` / `react-dom` (v18.3.1) - UI framework
- `typescript` (v5.5.3) - Type safety
- `vite` (v5.4.2) - Build tool and dev server

**State & Utilities:**
- `zustand` (v5.0.9) - Lightweight state management
- `date-fns` (v4.1.0) - Date manipulation and formatting
- `clsx` (v2.1.1) - Conditional className utility

**Visualization:**
- `echarts` (v5.6.0) - Charting library
- `echarts-for-react` (v3.0.5) - React wrapper for ECharts
- `echarts-wordcloud` (v2.1.0) - Word cloud extension for ECharts

**UI:**
- `lucide-react` (v0.344.0) - Icon library
- `tailwindcss` (v3.4.1) - Utility CSS framework

**Backend (Prepared but not actively used):**
- `@supabase/supabase-js` (v2.57.4) - Supabase client (dependency present but no active integration in codebase)

### Third-Party Services

Currently the application uses mock data. The Supabase dependency suggests future plans for:
- PostgreSQL database integration via Supabase
- Potential authentication and real-time data sync

### Configuration Files

- `vite.config.ts` - Vite configuration with path aliases (@assets → attached_assets)
- `tailwind.config.js` - TailwindCSS configuration
- `tsconfig.app.json` - TypeScript config for application code (strict mode enabled)
- `eslint.config.js` - ESLint with React hooks and refresh plugins