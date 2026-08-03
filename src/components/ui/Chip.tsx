import React from 'react';
import { cn } from '../../lib/utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  className,
  active = false,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none border',
        active
          ? 'bg-brand-accent text-white border-brand-accent shadow-accent-glow'
          : 'bg-brand-surface text-brand-muted border-brand-surface-border hover:border-brand-accent/50 hover:text-brand-text',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
