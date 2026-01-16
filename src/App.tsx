import { useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { GlobalFilters } from './components/layout/GlobalFilters';
import { HomePage } from './components/pages/HomePage';
import { RegionalAnalysisPage } from './components/pages/RegionalAnalysisPage';
import { StoreAnalysisPage } from './components/pages/StoreAnalysisPage';
import { ContentAnalysisPage } from './components/pages/ContentAnalysisPage';
import { ReviewToolsPage } from './components/pages/ReviewToolsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { StoreDetailDrawer } from './components/common/StoreDetailDrawer';
import { ReviewDrawer } from './components/common/ReviewDrawer';
import ReviewDrillDownDrawer from './components/common/ReviewDrillDownDrawer';
import { useDashboardStore } from './store/dashboardStore';
import { getReviews } from './data/mockData';

function App() {
  const {
    filters,
    activePage,
    setLoading,
    reviewDrillDownState,
    showReviewDrillDown,
    closeReviewDrillDown
  } = useDashboardStore();

  const allReviews = getReviews();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [filters, setLoading]);

  const pages = {
    home: <HomePage />,
    regionalAnalysis: <RegionalAnalysisPage />,
    storeAnalysis: <StoreAnalysisPage />,
    contentAnalysis: <ContentAnalysisPage />,
    reviewTools: <ReviewToolsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 p-6 overflow-auto">
          {(activePage === 'home' || activePage === 'regionalAnalysis') && <GlobalFilters />}

          {pages[activePage]}
        </main>
      </div>

      <StoreDetailDrawer />
      <ReviewDrawer />

      {reviewDrillDownState && (
        <ReviewDrillDownDrawer
          isOpen={showReviewDrillDown}
          onClose={closeReviewDrillDown}
          storeId={reviewDrillDownState.storeId}
          storeName={reviewDrillDownState.storeName}
          tagFilter={reviewDrillDownState.tagFilter}
          sentiment={reviewDrillDownState.sentiment}
          reviews={allReviews}
        />
      )}
    </div>
  );
}

export default App;
