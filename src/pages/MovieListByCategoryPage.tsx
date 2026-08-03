import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMovieListPage } from '../hooks/useMovieListPage';
import { Breadcrumb } from '../components/shared/Breadcrumb';
import { FilterBar } from '../components/shared/FilterBar';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Pagination } from '../components/shared/Pagination';
import { ErrorState } from '../components/ui/ErrorState';
import { TYPE_TABS } from '../lib/constants';
import { UI_MESSAGES } from '../lib/messages';
import { cn } from '../lib/utils';

export const MovieListByCategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const categorySlug = slug || 'hanh-dong';
  const [activeType, setActiveType] = useState('phim-bo');

  const {
    movies,
    pagination,
    seoOnPage,
    loading,
    error,
    refetch,
    filters,
    updateFilters,
    resetAllFilters,
    page,
    setPage,
    categories,
    countries,
  } = useMovieListPage({
    defaultType: activeType,
    lockedCategory: categorySlug,
  });

  const matchedCat = categories.find((c) => c.slug === categorySlug);
  const categoryName = matchedCat ? matchedCat.name : categorySlug.replace(/-/g, ' ');

  const defaultTitle = `Phim ${categoryName} Vietsub Mới Nhất`;
  const pageTitle = seoOnPage?.titleHead || defaultTitle;

  useEffect(() => {
    document.title = `${pageTitle} - CineStream`;
  }, [pageTitle]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Thể Loại', href: '/#the-loai' },
          { label: categoryName },
        ]}
      />

      {/* Page Heading & SEO Paragraph */}
      <div className="space-y-2 border-b border-brand-surface-border/50 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight capitalize">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-3xl leading-relaxed">
          Tổng hợp danh sách các bộ phim thể loại <strong>{categoryName}</strong> hấp dẫn nhất với chất lượng hình ảnh sắc nét, âm thanh sống động và phụ đề Vietsub cập nhật liên tục. Trải nghiệm xem phim mượt mà hoàn toàn miễn phí trên CineStream.
        </p>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-brand-dim uppercase tracking-wider pr-2">
          Loại Phim:
        </span>
        {TYPE_TABS.map((tab, idx) => {
          const isActive = activeType === tab.type && idx !== 0;
          return (
            <button
              key={`${tab.label}-${idx}`}
              onClick={() => setActiveType(tab.type)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border',
                isActive
                  ? 'bg-brand-accent text-white border-brand-accent shadow-accent-glow'
                  : 'bg-brand-surface text-brand-muted border-brand-surface-border hover:border-brand-accent/50 hover:text-brand-text'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* FilterBar (Category Locked) */}
      <FilterBar
        categories={categories}
        countries={countries}
        selectedFilters={filters}
        onChange={updateFilters}
        lockedFilter="category"
      />

      {/* MovieGrid or Error */}
      {error ? (
        <ErrorState
          title={`Lỗi tải danh sách phim thể loại ${categoryName}`}
          message={error}
          onRetry={refetch}
        />
      ) : (
        <MovieGrid
          items={movies}
          loading={loading}
          emptyMessage={`Không tìm thấy phim thể loại "${categoryName}" phù hợp bộ lọc.`}
        />
      )}

      {/* Empty State Reset Helper */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center pt-2">
          <button
            onClick={resetAllFilters}
            className="text-xs text-brand-accent hover:underline font-semibold"
          >
            {UI_MESSAGES.RESET_FILTERS}
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
