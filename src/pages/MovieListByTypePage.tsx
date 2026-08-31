import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMovieListPage } from '../hooks/useMovieListPage';
import { Breadcrumb } from '../components/shared/Breadcrumb';
import { FilterBar } from '../components/shared/FilterBar';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Pagination } from '../components/shared/Pagination';
import { ErrorState } from '../components/ui/ErrorState';
import { SEO } from '../components/shared/SEO';

const TYPE_TITLE_MAP: Record<string, string> = {
  'phim-bo': 'Phim Bộ Vietsub Mới Nhất',
  'phim-le': 'Phim Lẻ Chiếu Rạp Mới Nhất',
  'hoat-hinh': 'Anime & Phim Hoạt Hình',
  'tv-shows': 'TV Shows & Chương Trình Truyền Hình',
  'phim-moi-cap-nhat': 'Phim Mới Cập Nhật',
};

export const MovieListByTypePage: React.FC = () => {
  const { typeSlug } = useParams<{ typeSlug: string }>();
  const activeType = typeSlug || 'phim-bo';

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
  } = useMovieListPage({ defaultType: activeType });

  const defaultTitle = TYPE_TITLE_MAP[activeType] || `Danh Sách Phim ${activeType}`;
  const pageTitle = seoOnPage?.titleHead || defaultTitle;
  const pageDescription = seoOnPage?.descriptionHead || `Tổng hợp ${pageTitle.toLowerCase()} chọn lọc chất lượng cao, cập nhật nhanh nhất tại CineStream.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${pageTitle}, xem phim ${activeType}, phim hd, cinestream`}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: defaultTitle }]} />

      {/* Page Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
          {pageTitle}
        </h1>
        {seoOnPage?.descriptionHead ? (
          <p className="text-sm text-brand-muted max-w-3xl leading-relaxed">
            {seoOnPage.descriptionHead}
          </p>
        ) : (
          <p className="text-sm text-brand-muted">
            Tổng hợp danh sách {defaultTitle.toLowerCase()} chất lượng cao, cập nhật liên tục với phụ đề Vietsub mượt mà.
          </p>
        )}
      </div>

      {/* FilterBar */}
      <FilterBar
        categories={categories}
        countries={countries}
        selectedFilters={filters}
        onChange={updateFilters}
      />

      {/* MovieGrid or Error */}
      {error ? (
        <ErrorState
          title="Lỗi tải danh sách phim"
          message={error}
          onRetry={refetch}
        />
      ) : (
        <MovieGrid
          items={movies}
          loading={loading}
          emptyMessage="Không tìm thấy phim nào phù hợp với bộ lọc đã chọn."
        />
      )}

      {/* Empty State Reset Helper */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center pt-2">
          <button
            onClick={resetAllFilters}
            className="text-xs text-brand-accent hover:underline font-semibold"
          >
            Đặt lại toàn bộ bộ lọc
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
