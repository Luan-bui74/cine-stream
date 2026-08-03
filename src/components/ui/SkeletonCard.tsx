import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden bg-brand-surface border border-brand-surface-border/50 animate-pulse flex flex-col h-full',
        className
      )}
    >
      {/* Poster Skeleton 2:3 */}
      <div className="relative aspect-poster w-full bg-brand-surface-light">
        <div className="absolute top-2 left-2 w-10 h-4 bg-brand-surface rounded" />
        <div className="absolute bottom-2 left-2 w-14 h-4 bg-brand-surface rounded" />
      </div>

      {/* Card Info Skeleton */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="h-4 bg-brand-surface-light rounded w-5/6" />
          <div className="h-3 bg-brand-surface-light rounded w-3/5" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-brand-surface-border/40">
          <div className="h-3 bg-brand-surface-light rounded w-8" />
          <div className="h-3 bg-brand-surface-light rounded w-10" />
        </div>
      </div>
    </div>
  );
};
