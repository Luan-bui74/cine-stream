/**
 * Application Design & Configuration Constants
 */

export const DEFAULT_API_BASE_URL = "https://phimapi.com";
export const CDN_BASE_URL =
  import.meta.env.VITE_CDN_IMAGE_URL || "https://phimimg.com";

export const MAIN_NAV_ITEMS = [
  { label: "Phim Bộ", path: "/danh-sach/phim-bo" },
  { label: "Phim Lẻ", path: "/danh-sach/phim-le" },
  { label: "Hoạt Hình", path: "/danh-sach/hoat-hinh" },
  { label: "TV Shows", path: "/danh-sach/tv-shows" },
];

export const STORAGE_KEYS = {
  THEME_MODE: "theme",
  BOOKMARKS: "favorites",
  WATCH_HISTORY: "history",
  PROGRESS: (slug: string, episodeSlug: string) =>
    `progress:${slug}:${episodeSlug}`,
};

export const PAGINATION_LIMITS = {
  HOME_SECTION: 12,
  HOME_NEW: 18,
  LIST_PAGE: 24,
  RELATED: 12,
  RECOMMENDED_404: 6,
};

export const TIMING = {
  AUTO_SLIDE_INTERVAL_MS: 5000,
  AUTO_PLAY_COUNTDOWN_SEC: 5,
  SAVE_PROGRESS_THROTTLE_SEC: 5,
  DEBOUNCE_SEARCH_MS: 400,
};

export const MAX_HISTORY_ITEMS = 50;

export const START_YEAR = 1990;

export const TYPE_TABS = [
  { label: "Tất cả", type: "phim-bo" },
  { label: "Phim Bộ", type: "phim-bo" },
  { label: "Phim Lẻ", type: "phim-le" },
  { label: "Hoạt Hình", type: "hoat-hinh" },
  { label: "TV Shows", type: "tv-shows" },
];

export const LANG_OPTIONS = [
  { label: "Tất cả ngôn ngữ", value: "" },
  { label: "Vietsub", value: "vietsub" },
  { label: "Thuyết Minh", value: "thuet-minh" },
  { label: "Lồng Tiếng", value: "long-tieng" },
];

export const SORT_OPTIONS = [
  { label: "Mới cập nhật", field: "modified.time", type: "desc" },
  { label: "Mới nhất", field: "_id", type: "desc" },
  { label: "Năm phát hành ↓", field: "year", type: "desc" },
  { label: "Năm phát hành ↑", field: "year", type: "asc" },
];

export const DEFAULT_CATEGORIES = [
  { _id: 'cat-1', name: 'Hành Động', slug: 'hanh-dong' },
  { _id: 'cat-2', name: 'Tình Cảm', slug: 'tinh-cam' },
  { _id: 'cat-3', name: 'Cổ Trang', slug: 'co-trang' },
  { _id: 'cat-4', name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { _id: 'cat-5', name: 'Hài Hước', slug: 'hai-huoc' },
  { _id: 'cat-6', name: 'Tâm Lý', slug: 'tam-ly' },
  { _id: 'cat-7', name: 'Võ Thuật', slug: 'vo-thuat' },
  { _id: 'cat-8', name: 'Kinh Dị', slug: 'kinh-di' },
  { _id: 'cat-9', name: 'Hoạt Hình', slug: 'hoat-hinh' },
  { _id: 'cat-10', name: 'Phiêu Lưu', slug: 'phieu-luu' },
  { _id: 'cat-11', name: 'Hình Sự', slug: 'hinh-su' },
  { _id: 'cat-12', name: 'Chiến Tranh', slug: 'chien-tranh' },
  { _id: 'cat-13', name: 'Thể Thao', slug: 'the-thao' },
  { _id: 'cat-14', name: 'Âm Nhạc', slug: 'am-nhac' },
  { _id: 'cat-15', name: 'Gia Đình', slug: 'gia-dinh' },
  { _id: 'cat-16', name: 'Học Đường', slug: 'hoc-duong' },
];

export const DEFAULT_COUNTRIES = [
  { _id: 'cou-1', name: 'Trung Quốc', slug: 'trung-quoc' },
  { _id: 'cou-2', name: 'Hàn Quốc', slug: 'han-quoc' },
  { _id: 'cou-3', name: 'Mỹ', slug: 'my' },
  { _id: 'cou-4', name: 'Nhật Bản', slug: 'nhat-ban' },
  { _id: 'cou-5', name: 'Thái Lan', slug: 'thai-lan' },
  { _id: 'cou-6', name: 'Việt Nam', slug: 'viet-nam' },
  { _id: 'cou-7', name: 'Đài Loan', slug: 'dai-loan' },
  { _id: 'cou-8', name: 'Ấn Độ', slug: 'an-do' },
  { _id: 'cou-9', name: 'Anh', slug: 'anh' },
  { _id: 'cou-10', name: 'Pháp', slug: 'phap' },
  { _id: 'cou-11', name: 'Hồng Kông', slug: 'hong-kong' },
];
