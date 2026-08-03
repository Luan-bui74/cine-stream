import React from 'react';
import { useAppStore } from '../store/AppContext';
import { MovieGrid } from '../components/movie/MovieGrid';
import { MovieSummary } from '../types/movie';

export const BookmarksPage: React.FC = () => {
  const { bookmarks } = useAppStore();

  const formattedMovies: MovieSummary[] = bookmarks.map((b) => ({
    _id: b._id,
    name: b.name,
    slug: b.slug,
    origin_name: b.name,
    thumb_url: b.poster_url,
    poster_url: b.poster_url,
    year: b.year || 2024,
    quality: b.quality || 'FHD',
    lang: 'Vietsub',
    episode_current: 'Đã lưu',
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tủ Phim Đã Lưu</h1>
        <p className="text-sm text-brand-muted mt-1">Danh sách phim bạn đã lưu lại để xem sau.</p>
      </div>

      <MovieGrid
        items={formattedMovies}
        emptyMessage="Chưa có phim nào trong tủ. Hãy bấm biểu tượng bookmark trên poster phim để thêm phim vào tủ của bạn."
      />
    </div>
  );
};
