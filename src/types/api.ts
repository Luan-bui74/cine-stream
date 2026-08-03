import {
  Category,
  Country,
  PhimApiListResult,
  PhimApiDetailResult,
  ServerDataItem,
  Episode,
} from './movie';

/**
 * Union result type for API operations
 * Every API function returns Promise<ApiResult<T>> without throwing exceptions
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Backwards-compatibility aliases
export type ApiResponse<T> = ApiResult<T>;
export type PhimCategoryItem = Category;
export type PhimCountryItem = Country;
export type PhimApiListResponse<T> = PhimApiListResult<T>;
export type PhimApiDetailResponse = PhimApiDetailResult;

export type {
  Pagination,
  PhimApiListResult,
  PhimApiDetailResult,
  Category,
  Country,
} from './movie';
