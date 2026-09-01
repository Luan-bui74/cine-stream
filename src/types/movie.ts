export type MovieType = 'single' | 'series' | 'hoathinh' | 'tvshows';

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
}

export interface Country {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
}

export interface ServerDataItem {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export type EpisodeData = ServerDataItem;

export interface Episode {
  server_name: string;
  server_data: ServerDataItem[];
}

export type MovieServerGroup = Episode;

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface TmdbMeta {
  type?: string;
  id?: string;
  season?: number;
  vote_average?: number;
  vote_count?: number;
}

export interface ImdbMeta {
  id?: string;
}

export interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  year: number;
  poster_url: string;
  thumb_url: string;
  quality: string;
  lang: string;
  episode_current: string;
  episode_total: string;
  category: Category[];
  country: Country[];
  content: string;
  view?: number;
  tmdb?: TmdbMeta;
  imdb?: ImdbMeta;
  type: MovieType;
  status: string;
  is_copyright?: boolean;
  sub_docquyen?: boolean;
  chieurap?: boolean;
  trailer_url?: string;
  time?: string;
  notify?: string;
  showtimes?: string;
  actor?: string[];
  director?: string[];
  modified?: {
    time: string;
  };
}

export type MovieDetail = Movie;

export interface MovieSummary {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  year: number;
  poster_url: string;
  thumb_url: string;
  quality: string;
  lang: string;
  episode_current: string;
  time?: string;
  type?: MovieType;
  view?: number;
  modified?: {
    time: string;
  };
}

export interface TypeListFilters {
  page?: number;
  sort_field?: string;
  sort_type?: 'asc' | 'desc';
  sort_lang?: string;
  category?: string;
  country?: string;
  year?: number | string;
  limit?: number;
}

export interface PhimApiListResult<T> {
  status: boolean;
  msg?: string;
  items: T[];
  pagination: Pagination;
  seoOnPage?: {
    titleHead?: string;
    descriptionHead?: string;
  };
}

export interface PhimApiDetailResult {
  status: boolean;
  msg?: string;
  movie: Movie;
  episodes: Episode[];
}

export interface BookmarkItem {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  year?: number;
  quality?: string;
}

export interface WatchHistoryItem {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  episodeName: string;
  episodeSlug: string;
  serverName: string;
  timestamp: number;
  progressSeconds?: number;
  durationSeconds?: number;
}
