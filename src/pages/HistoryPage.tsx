import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History, Play, Trash2, X, AlertTriangle } from 'lucide-react';
import { useHistory } from '../store/HistoryContext';
import { resolveImage } from '../lib/utils';
import { Breadcrumb } from '../components/shared/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/shared/SEO';
import { ROUTES } from '../lib/routes';
import { UI_MESSAGES } from '../lib/messages';

export const HistoryPage: React.FC = () => {
  const { history, removeHistoryItem, clearHistory } = useHistory();
  const navigate = useNavigate();

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <SEO
        title="Lịch Sử Xem Phim"
        description="Danh sách các bộ phim bạn đã xem gần đây."
        robots="noindex, nofollow"
      />

      {/* Clear All History Confirmation Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setConfirmClearOpen(false)}
          />
          <div className="relative max-w-md w-full bg-brand-surface border border-brand-surface-border rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-brand-text">Xác Nhận Xóa Lịch Sử</h3>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmClearOpen(false)}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  clearHistory();
                  setConfirmClearOpen(false);
                }}
              >
                Xóa Toàn Bộ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Lịch Sử Xem Phim' }]} />

      {/* Page Heading */}
      <div className="flex items-center justify-between border-b border-brand-surface-border/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-brand-accent" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
              Lịch Sử Xem Phim
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-brand-muted">
            Theo dõi tiến trình và tiếp tục các tập phim bạn đang xem dở.
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setConfirmClearOpen(true)}
          >
            Xóa lịch sử
          </Button>
        )}
      </div>

      {/* Content Grid or Empty State */}
      {sortedHistory.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8 text-brand-dim" />}
          title="Chưa có lịch sử xem phim"
          description="Các bộ phim bạn đã thưởng thức sẽ tự động lưu lại tiến trình tại đây."
          actionLabel={UI_MESSAGES.EXPLORE_NOW}
          onAction={() => navigate(ROUTES.HOME)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedHistory.map((item) => {
            const currentTime = item.progressSeconds || 0;
            const duration = item.durationSeconds || 0;
            const percentage =
              duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

            const watchedTimeFormatted =
              currentTime > 0
                ? `${Math.floor(currentTime / 60)} phút`
                : 'Mới xem';

            const watchUrl = ROUTES.WATCH(item.slug, item.episodeSlug);

            return (
              <div
                key={`${item.slug}-${item.episodeSlug}`}
                className="group relative rounded-2xl bg-brand-surface border border-brand-surface-border hover:border-brand-accent/50 p-3.5 transition-all flex gap-4 items-center"
              >
                {/* Poster Snapshot */}
                <Link
                  to={watchUrl}
                  className="relative aspect-poster w-20 flex-shrink-0 rounded-xl overflow-hidden bg-brand-surface-light"
                >
                  <img
                    src={resolveImage(item.poster_url)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </Link>

                {/* Details & Progress */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={watchUrl}
                      className="font-bold text-sm text-brand-text line-clamp-1 hover:text-brand-accent transition-colors"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeHistoryItem(item.slug, item.episodeSlug)}
                      className="p-1 text-brand-dim hover:text-red-400 rounded-md transition-colors"
                      title="Xóa khỏi lịch sử"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-brand-accent font-semibold">
                    {item.episodeName}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-brand-dim">
                      <span>{watchedTimeFormatted}</span>
                      {percentage > 0 && <span>{percentage}%</span>}
                    </div>
                    <div className="w-full h-1.5 bg-brand-surface-light rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full transition-all duration-300"
                        style={{ width: `${percentage > 0 ? percentage : 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link to={watchUrl}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full py-1 text-xs"
                        leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                      >
                        Xem Tiếp
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
