import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, X, Undo2 } from 'lucide-react';
import { useFavorites } from '../store/FavoritesContext';
import { BookmarkItem } from '../types/movie';
import { resolveImage } from '../lib/utils';
import { Breadcrumb } from '../components/shared/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { SEO } from '../components/shared/SEO';
import { ROUTES } from '../lib/routes';
import { UI_MESSAGES } from '../lib/messages';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite, restoreFavorite } = useFavorites();
  const navigate = useNavigate();

  const [lastRemovedItem, setLastRemovedItem] = useState<BookmarkItem | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleRemove = (e: React.MouseEvent, item: BookmarkItem) => {
    e.preventDefault();
    e.stopPropagation();
    const removed = removeFavorite(item.slug);
    if (removed) {
      setLastRemovedItem(removed);
      setShowToast(true);
    }
  };

  const handleUndo = () => {
    if (lastRemovedItem) {
      restoreFavorite(lastRemovedItem);
      setLastRemovedItem(null);
      setShowToast(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <SEO
        title="Tủ Phim Yêu Thích"
        description="Danh sách các bộ phim bạn đã lưu lại để theo dõi."
        robots="noindex, nofollow"
      />

      {/* Toast Notification with Undo Button */}
      {showToast && lastRemovedItem && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-surface border border-brand-surface-border shadow-2xl text-xs text-brand-text">
            <span>Đã xóa &quot;{lastRemovedItem.name}&quot; khỏi danh sách yêu thích.</span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 text-brand-accent font-bold hover:underline cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Hoàn tác</span>
            </button>
            <button
              onClick={() => setShowToast(false)}
              className="p-0.5 text-brand-dim hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Tủ Phim Yêu Thích' }]} />

      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-brand-surface-border/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-accent fill-brand-accent" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
              Tủ Phim Yêu Thích
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-brand-muted">
            Danh sách các bộ phim bạn đã đánh dấu để thưởng thức sau.
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-muted bg-brand-surface border border-brand-surface-border px-3 py-1.5 rounded-full">
          {favorites.length} bộ phim
        </span>
      </div>

      {/* Content Grid or Empty State */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8 text-brand-accent" />}
          title="Bạn chưa lưu phim nào"
          description="Hãy bấm vào biểu tượng trái tim hoặc bookmark trên poster phim để lưu vào tủ phim của bạn."
          actionLabel={UI_MESSAGES.EXPLORE_NOW}
          onAction={() => navigate(ROUTES.HOME)}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {favorites.map((item) => (
            <div
              key={item.slug}
              className="group relative rounded-xl overflow-hidden bg-brand-surface border border-brand-surface-border transition-all duration-300 hover:border-brand-accent/50 flex flex-col h-full"
            >
              <Link
                to={ROUTES.MOVIE(item.slug)}
                className="block relative aspect-poster overflow-hidden bg-brand-surface-light"
              >
                <img
                  src={resolveImage(item.poster_url)}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = resolveImage(null);
                  }}
                />

                {/* Delete X Button */}
                <button
                  onClick={(e) => handleRemove(e, item)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-red-600 transition-colors z-20"
                  title="Xóa khỏi yêu thích"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="absolute top-2 left-2 z-10">
                  {item.quality && <Badge variant="accent">{item.quality}</Badge>}
                </div>
              </Link>

              <div className="p-3 flex flex-col flex-1 justify-between bg-brand-surface">
                <div>
                  <Link
                    to={ROUTES.MOVIE(item.slug)}
                    className="font-bold text-sm text-brand-text line-clamp-1 group-hover:text-brand-accent transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] text-brand-dim mt-2 pt-2 border-t border-brand-surface-border/40">
                  <span>{item.year || 2024}</span>
                  <span className="text-emerald-400 font-medium">Đã lưu</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
