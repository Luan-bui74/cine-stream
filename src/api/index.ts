import { axiosInstance } from './client';
import { ApiResult } from '../types/api';
import {
  MovieSummary,
  PhimApiListResult,
  PhimApiDetailResult,
  Category,
  Country,
  TypeListFilters,
} from '../types/movie';
import { AxiosError } from 'axios';

/**
 * Helper to wrap Axios calls into a safe ApiResult<T> without throwing
 */
async function fetchSafe<T>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResult<T>> {
  try {
    const response = await axiosInstance.get<T>(url, { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    const error = err as AxiosError<{ message?: string; msg?: string }>;
    let errorMessage = 'Đã có lỗi xảy ra khi kết nối tới hệ thống phim.';

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Quá thời gian kết nối (Timeout). Vui lòng thử lại.';
    } else if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.msg ||
        `Lỗi máy chủ (${error.response.status}).`;
    } else if (error.request) {
      errorMessage = 'Không nhận được phản hồi từ máy chủ PhimAPI.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Helper to extract and normalize PhimAPI list responses (v1 vs non-v1 API)
 */
function extractListData(raw: any): PhimApiListResult<MovieSummary> {
  if (!raw) {
    return {
      status: false,
      items: [],
      pagination: { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 0 },
    };
  }

  // Handle /v1/api/ response nested inside raw.data vs root raw
  const container = raw.data || raw;
  const items = container.items || raw.items || [];
  const pagination =
    container.params?.pagination ||
    container.pagination ||
    raw.pagination ||
    { totalItems: items.length, totalItemsPerPage: 24, currentPage: 1, totalPages: 1 };

  const seoOnPage = container.seoOnPage || raw.seoOnPage;

  return {
    status: Boolean(raw.status || container.status),
    items: Array.isArray(items) ? items : [],
    pagination,
    seoOnPage,
  };
}

/**
 * Helper to extract array data safely from PhimAPI responses (supporting deeply nested raw.data.items)
 */
function extractArrayData<T>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.data)) return raw.data;
  if (raw.data && Array.isArray(raw.data.items)) return raw.data.items;
  if (raw.data && Array.isArray(raw.data.data)) return raw.data.data;
  return [];
}

/**
 * GET /danh-sach/phim-moi-cap-nhat?page=
 */
export async function getNewMovies(
  page: number = 1
): Promise<ApiResult<PhimApiListResult<MovieSummary>>> {
  const res = await fetchSafe<any>('/danh-sach/phim-moi-cap-nhat', { page });
  if (res.success) {
    return {
      success: true,
      data: extractListData(res.data),
    };
  }
  return res;
}

/**
 * GET /v1/api/danh-sach/{type_list}?page=&sort_field=&sort_type=&sort_lang=&category=&country=&year=&limit=
 */
export async function getMoviesByType(
  type: string,
  filters: TypeListFilters = {}
): Promise<ApiResult<PhimApiListResult<MovieSummary>>> {
  const cleanParams: Record<string, any> = {};

  if (filters.page) cleanParams.page = filters.page;
  if (filters.sort_field) cleanParams.sort_field = filters.sort_field;
  if (filters.sort_type) cleanParams.sort_type = filters.sort_type;
  if (filters.sort_lang) cleanParams.sort_lang = filters.sort_lang;
  if (filters.category) cleanParams.category = filters.category;
  if (filters.country) cleanParams.country = filters.country;
  if (filters.year) cleanParams.year = filters.year;
  if (filters.limit) cleanParams.limit = filters.limit;

  const res = await fetchSafe<any>(`/v1/api/danh-sach/${type}`, cleanParams);
  if (res.success) {
    return {
      success: true,
      data: extractListData(res.data),
    };
  }
  return res;
}

/**
 * GET /v1/api/tim-kiem?keyword=&page= (With Multi-tier Fallback for 503 & CORS resilience)
 */
export async function searchMovies(
  keyword: string,
  page: number = 1
): Promise<ApiResult<PhimApiListResult<MovieSummary>>> {
  const cleanKw = keyword.trim();
  if (!cleanKw) {
    return {
      success: true,
      data: {
        status: true,
        items: [],
        pagination: { totalItems: 0, totalItemsPerPage: 24, currentPage: 1, totalPages: 0 },
      },
    };
  }

  // Tier 1: Try /v1/api/tim-kiem
  const res1 = await fetchSafe<any>('/v1/api/tim-kiem', { keyword: cleanKw, page });
  if (res1.success && res1.data) {
    const list = extractListData(res1.data);
    if (list.items && list.items.length > 0) {
      return { success: true, data: list };
    }
  }

  // Tier 2: Fallback to /tim-kiem
  const res2 = await fetchSafe<any>('/tim-kiem', { keyword: cleanKw, page });
  if (res2.success && res2.data) {
    const list = extractListData(res2.data);
    if (list.items && list.items.length > 0) {
      return { success: true, data: list };
    }
  }

  // Tier 3: Client-side fallback filter on getNewMovies if API returns 503 or CORS block
  const res3 = await getNewMovies(1);
  if (res3.success && res3.data?.items) {
    const queryLower = cleanKw.toLowerCase();
    const filtered = res3.data.items.filter(
      (m) =>
        m.name?.toLowerCase().includes(queryLower) ||
        m.origin_name?.toLowerCase().includes(queryLower) ||
        m.slug?.toLowerCase().includes(queryLower)
    );
    return {
      success: true,
      data: {
        status: true,
        items: filtered,
        pagination: {
          totalItems: filtered.length,
          totalItemsPerPage: 24,
          currentPage: 1,
          totalPages: 1,
        },
      },
    };
  }

  return res1;
}

/**
 * GET /phim/{slug} -> { movie, episodes }
 */
export async function getMovieDetail(
  slug: string
): Promise<ApiResult<PhimApiDetailResult>> {
  return fetchSafe<PhimApiDetailResult>(`/phim/${slug}`);
}

/**
 * GET /the-loai -> list of category { name, slug }
 */
export async function getCategories(): Promise<ApiResult<Category[]>> {
  let result = await fetchSafe<any>('/v1/api/the-loai');
  if (!result.success || extractArrayData(result.data).length === 0) {
    result = await fetchSafe<any>('/the-loai');
  }

  if (result.success) {
    return {
      success: true,
      data: extractArrayData<Category>(result.data),
    };
  }
  return result;
}

/**
 * GET /quoc-gia -> list of country { name, slug }
 */
export async function getCountries(): Promise<ApiResult<Country[]>> {
  let result = await fetchSafe<any>('/v1/api/quoc-gia');
  if (!result.success || extractArrayData(result.data).length === 0) {
    result = await fetchSafe<any>('/quoc-gia');
  }

  if (result.success) {
    return {
      success: true,
      data: extractArrayData<Country>(result.data),
    };
  }
  return result;
}
