import React from 'react';
import { Film } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-brand-surface border border-brand-surface-border/50 my-4',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-surface-light border border-brand-surface-border flex items-center justify-center text-brand-muted mb-4 shadow-inner">
        {icon || <Film className="w-8 h-8 text-brand-dim" />}
      </div>
      <h3 className="text-lg font-bold text-brand-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-brand-muted max-w-md mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
