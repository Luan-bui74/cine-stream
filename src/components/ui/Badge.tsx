import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'quality' | 'sub' | 'dark' | 'gold';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'dark',
  size = 'sm',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center font-semibold rounded tracking-wide uppercase select-none';

  const variants = {
    accent: 'bg-brand-accent text-white',
    quality: 'bg-indigo-600 text-white',
    sub: 'bg-emerald-600 text-white',
    dark: 'bg-brand-surface-light text-brand-muted border border-brand-surface-border',
    gold: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px] leading-none',
    md: 'px-2 py-1 text-xs leading-none',
  };

  return (
    <span
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
