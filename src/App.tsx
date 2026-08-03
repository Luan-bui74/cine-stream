import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Spinner } from './components/ui/Spinner';

import { RootLayout } from './components/layout/RootLayout';
import { PlayerLayout } from './components/layout/PlayerLayout';

// React.lazy Route Code-Splitting
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const MovieDetailPage = lazy(() =>
  import('./pages/MovieDetailPage').then((m) => ({ default: m.MovieDetailPage }))
);
const WatchPage = lazy(() => import('./pages/WatchPage').then((m) => ({ default: m.WatchPage })));
const MovieListByCategoryPage = lazy(() =>
  import('./pages/MovieListByCategoryPage').then((m) => ({ default: m.MovieListByCategoryPage }))
);
const MovieListByCountryPage = lazy(() =>
  import('./pages/MovieListByCountryPage').then((m) => ({ default: m.MovieListByCountryPage }))
);
const MovieListByTypePage = lazy(() =>
  import('./pages/MovieListByTypePage').then((m) => ({ default: m.MovieListByTypePage }))
);
const CountryIndexPage = lazy(() =>
  import('./pages/CountryIndexPage').then((m) => ({ default: m.CountryIndexPage }))
);
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const FavoritesPage = lazy(() =>
  import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
);
const HistoryPage = lazy(() => import('./pages/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const ComponentDemoPage = lazy(() =>
  import('./pages/dev/ComponentDemoPage').then((m) => ({ default: m.ComponentDemoPage }))
);

const PageFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Standard Pages wrapped in RootLayout (Header + Footer) */}
              <Route element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="phim/:slug" element={<MovieDetailPage />} />
                <Route path="the-loai/:slug" element={<MovieListByCategoryPage />} />
                <Route path="quoc-gia" element={<CountryIndexPage />} />
                <Route path="quoc-gia/:slug" element={<MovieListByCountryPage />} />
                <Route path="danh-sach/:typeSlug" element={<MovieListByTypePage />} />
                <Route path="tim-kiem" element={<SearchPage />} />
                <Route path="yeu-thich" element={<FavoritesPage />} />
                <Route path="tu-phim" element={<FavoritesPage />} />
                <Route path="lich-su" element={<HistoryPage />} />

                {/* Dev component showcase guarded strictly under DEV mode */}
                {import.meta.env.DEV && (
                  <Route path="dev/components" element={<ComponentDemoPage />} />
                )}

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Immersive Video Player Pages wrapped in PlayerLayout (Compact Header) */}
              <Route element={<PlayerLayout />}>
                <Route path="phim/:slug/tap/:episodeSlug" element={<WatchPage />} />
                <Route path="xem-phim/:slug/:episodeSlug?" element={<WatchPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
