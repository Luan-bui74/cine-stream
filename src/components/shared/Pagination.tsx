import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import { cn } from '../../lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const paginationRange = usePagination({ currentPage, totalPages });

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-1.5 py-8', className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl bg-brand-surface border border-brand-surface-border text-brand-muted hover:text-brand-text hover:bg-brand-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex items-center gap-1"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trước</span>
      </button>

      {/* Page Numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === 'DOTS') {
          return (
            <span
              key={`dots-${index}`}
              className="px-2.5 py-1 text-xs text-brand-dim select-none"
            >
              ...
            </span>
          );
        }

        const page = pageNumber as number;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[36px] h-[36px] px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border',
              isActive
                ? 'bg-brand-accent text-white border-brand-accent shadow-accent-glow'
                : 'bg-brand-surface text-brand-muted border-brand-surface-border hover:border-brand-accent/50 hover:text-brand-text hover:bg-brand-surface-light'
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl bg-brand-surface border border-brand-surface-border text-brand-muted hover:text-brand-text hover:bg-brand-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex items-center gap-1"
        aria-label="Trang sau"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
