import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { resolveImage, DEFAULT_POSTER_FALLBACK } from './image';

/**
 * Combine tailwind classes cleanly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format episode label for display
 */
export function formatEpisodeLabel(current?: string): string {
  if (!current) return 'Đang cập nhật';
  if (current.toLowerCase().includes('full')) return 'Tập Full';
  if (current.toLowerCase().startsWith('tập')) return current;
  if (!isNaN(Number(current))) return `Tập ${current}`;
  return current;
}

/**
 * Create URL slug from Vietnamese string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format date string
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format view count for human-readable display (e.g. 1.2K, 3.4M or 1,234)
 */
export function formatViews(views?: number): string {
  if (views === undefined || views === null) return '0';
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (views >= 10_000) {
    return `${(views / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return views.toLocaleString('vi-VN');
}

