import React from 'react';
import { Movie, MovieSummary } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from '../ui/SkeletonCard';
import { EmptyState } from '../ui/EmptyState';

export interface MovieGridProps {
  items: (Movie | MovieSummary)[];
  loading?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  items,
  loading = false,
  emptyMessage = 'Không tìm thấy bộ phim phù hợp với yêu cầu.',
  skeletonCount = 12,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <EmptyState title="Không có dữ liệu" description={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {items.map((movie) => (
        <MovieCard key={movie._id || movie.slug} movie={movie} />
      ))}
    </div>
  );
};
