import React from 'react';
import { Play, Check } from 'lucide-react';
import { Episode, ServerDataItem } from '../../types/movie';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export interface EpisodeSelectorProps {
  episodes: Episode[];
  currentEpisodeSlug?: string;
  watchedSlugs?: string[];
  onSelect: (ep: ServerDataItem) => void;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  episodes,
  currentEpisodeSlug,
  watchedSlugs = [],
  onSelect,
}) => {
  if (!episodes || episodes.length === 0) return null;

  const firstGroup = episodes[0];
  const serverDataList = firstGroup?.server_data || [];

  // Single Episode case
  if (serverDataList.length === 1) {
    const singleEp = serverDataList[0];
    const isWatched = watchedSlugs.includes(singleEp.slug);

    return (
      <div className="bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-surface-border flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-brand-text">Phim Lẻ / Phim Đơn</h3>
          <p className="text-xs text-brand-muted mt-0.5">Thưởng thức trọn bộ chất lượng cao.</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Play className="w-5 h-5 fill-current" />}
          onClick={() => onSelect(singleEp)}
        >
          {isWatched ? 'Xem Lại Phim' : 'Xem Phim Ngay'}
        </Button>
      </div>
    );
  }

  // Multiple Episodes case
  return (
    <div className="space-y-3 bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-surface-border">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-brand-text">Danh Sách Tập Phim</h3>
        <span className="text-xs text-brand-muted">
          Tổng số {serverDataList.length} tập
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-1">
        {serverDataList.map((ep) => {
          const isActive = currentEpisodeSlug === ep.slug;
          const isWatched = watchedSlugs.includes(ep.slug);

          return (
            <button
              key={ep.slug || ep.name}
              onClick={() => onSelect(ep)}
              className={cn(
                'relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-center truncate border flex items-center justify-center gap-1',
                isActive
                  ? 'bg-brand-accent text-white border-brand-accent shadow-accent-glow'
                  : isWatched
                  ? 'bg-brand-surface-light text-emerald-300 border-emerald-500/40 hover:border-brand-accent'
                  : 'bg-brand-surface-light text-brand-muted border-brand-surface-border hover:border-brand-accent/50 hover:text-brand-text'
              )}
              title={`Xem tập ${ep.name}${isWatched ? ' (Đã xem)' : ''}`}
            >
              {isWatched && !isActive && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
              <span>{ep.name.toLowerCase().includes('tập') ? ep.name : `Tập ${ep.name}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
