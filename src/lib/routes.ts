/**
 * Centralized Route Path Constants & Helper Generators
 */
export const ROUTES = {
  HOME: '/',
  MOVIE: (slug: string) => `/phim/${slug}`,
  WATCH: (slug: string, episodeSlug: string) => `/phim/${slug}/tap/${episodeSlug}`,
  CATEGORY: (slug: string) => `/the-loai/${slug}`,
  COUNTRY: (slug: string) => `/quoc-gia/${slug}`,
  COUNTRY_INDEX: '/quoc-gia',
  LIST: (typeSlug: string) => `/danh-sach/${typeSlug}`,
  SEARCH: (keyword?: string) =>
    keyword ? `/tim-kiem?keyword=${encodeURIComponent(keyword)}` : '/tim-kiem',
  FAVORITES: '/yeu-thich',
  HISTORY: '/lich-su',
};
