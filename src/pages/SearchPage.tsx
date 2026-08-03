import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { searchMovies } from '../api';
import { MovieSummary, Pagination as PaginationType } from '../types/movie';
import { Breadcrumb } from '../components/shared/Breadcrumb';
import { SearchBar } from '../components/shared/SearchBar';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Pagination } from '../components/shared/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10) || 1;

  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async () => {
    if (!keyword.trim()) {
      setMovies([]);
      setPagination(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await searchMovies(keyword.trim(), page);

    if (res.success && res.data) {
      setMovies(res.data.items || []);
      setPagination(res.data.pagination || null);
      setError(null);
    } else if (!res.success) {
      setError(res.error || 'Không thể tìm kiếm phim lúc này.');
      setMovies([]);
      setPagination(null);
    }
    setLoading(false);
  }, [keyword, page]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  useEffect(() => {
    document.title = keyword
      ? `Kết quả tìm kiếm cho "${keyword}" - CineStream`
      : 'Tìm kiếm phim - CineStream';
  }, [keyword]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewSearch = (newKeyword: string) => {
    setSearchParams({ keyword: newKeyword, page: '1' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tìm Kiếm' },
          ...(keyword ? [{ label: `"${keyword}"` }] : []),
        ]}
      />

      {/* Top Search Input Box */}
      <div className="bg-brand-surface border border-brand-surface-border p-4 rounded-2xl max-w-2xl mx-auto">
        <SearchBar
          placeholder="Nhập tên phim, diễn viên hoặc thể loại..."
          onSearchSubmit={handleNewSearch}
        />
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-surface-border/50 pb-4 gap-2">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-brand-accent" />
            {keyword ? (
              <span>
                Kết Quả Tìm Kiếm Cho: <span className="text-brand-accent">&quot;{keyword}&quot;</span>
              </span>
            ) : (
              <span>Tìm Kiếm Phim</span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            {keyword
              ? `Tìm thấy ${pagination?.totalItems || movies.length} kết quả phù hợp.`
              : 'Hãy nhập từ khóa vào ô tìm kiếm ở trên để bắt đầu.'}
          </p>
        </div>

        {pagination && pagination.totalItems > 0 && (
          <span className="text-xs font-semibold text-brand-muted bg-brand-surface border border-brand-surface-border px-3 py-1.5 rounded-full self-start sm:self-auto">
            Trang {page} / {pagination.totalPages}
          </span>
        )}
      </div>

      {/* Content Results */}
      {error ? (
        <ErrorState
          title="Không thể thực hiện tìm kiếm"
          message={error}
          onRetry={fetchSearchResults}
        />
      ) : !keyword.trim() ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8 text-brand-accent" />}
          title="Nhập từ khóa tìm kiếm"
          description="Bạn có thể tìm kiếm theo tên tiếng Việt, tên gốc tiếng Anh, diễn viên hoặc đạo diễn."
        />
      ) : !loading && movies.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-brand-dim" />}
          title="Không tìm thấy kết quả"
          description={`Không có bộ phim nào phù hợp với từ khóa "${keyword}". Thử tìm kiếm với từ khóa ngắn gọn hơn.`}
        />
      ) : (
        <MovieGrid items={movies} loading={loading} skeletonCount={12} />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
