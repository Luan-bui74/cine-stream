import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'relative rounded-xl overflow-hidden bg-brand-surface border border-brand-surface-border/50 animate-pulse',
          className
        )}
      >
        <div className="aspect-poster w-full bg-brand-surface-light" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-brand-surface-light rounded w-3/4" />
          <div className="h-3 bg-brand-surface-light rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-brand-surface-light animate-pulse',
        variant === 'circular' ? 'rounded-full' : 'rounded-lg',
        className
      )}
      {...props}
    />
  );
};
