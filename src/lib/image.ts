import { CDN_BASE_URL } from './constants';

export { CDN_BASE_URL };

export const DEFAULT_POSTER_FALLBACK = `${CDN_BASE_URL}/upload/poster-1.jpg`;

export const resolveImage = (path?: string | null): string => {
  if (!path || typeof path !== 'string') {
    return DEFAULT_POSTER_FALLBACK;
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return DEFAULT_POSTER_FALLBACK;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${CDN_BASE_URL}${cleanPath}`;
};
