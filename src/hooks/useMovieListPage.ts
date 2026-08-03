import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMoviesByType, getNewMovies, getCategories, getCountries } from '../api';
import { FilterState } from '../components/shared/FilterBar';
import { MovieSummary, Pagination, Category, Country } from '../types/movie';
import { PAGINATION_LIMITS, DEFAULT_CATEGORIES, DEFAULT_COUNTRIES } from '../lib/constants';

export interface UseMovieListPageOptions {
  defaultType?: string;
  lockedCategory?: string;
  lockedCountry?: string;
}

export function useMovieListPage({
  defaultType = 'phim-bo',
  lockedCategory,
  lockedCountry,
}: UseMovieListPageOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);

  // Parse filters from URL Search Params (URL is the ONLY source of truth)
  const page = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const filters: FilterState = useMemo(() => {
    return {
      category: lockedCategory || searchParams.get('category') || '',
      country: lockedCountry || searchParams.get('country') || '',
      year: searchParams.get('year') || '',
      lang: searchParams.get('sort_lang') || searchParams.get('lang') || '',
      sortField: searchParams.get('sort_field') || 'modified.time',
      sortType: (searchParams.get('sort_type') as 'asc' | 'desc') || 'desc',
    };
  }, [searchParams, lockedCategory, lockedCountry]);

  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [seoOnPage, setSeoOnPage] = useState<{ titleHead?: string; descriptionHead?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories & countries for dropdowns once
  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data);
      }
    });
    getCountries().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCountries(res.data);
      }
    });
  }, []);

  // Main data fetcher
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const typeList = defaultType || 'phim-bo';

    let result;

    if (typeList === 'phim-moi-cap-nhat') {
      result = await getNewMovies(page);
    } else {
      result = await getMoviesByType(typeList, {
        page,
        category: filters.category,
        country: filters.country,
        year: filters.year,
        sort_lang: filters.lang,
        sort_field: filters.sortField,
        sort_type: filters.sortType,
        limit: PAGINATION_LIMITS.LIST_PAGE,
      });
    }

    if (result.success) {
      setMovies(result.data.items || []);
      setPagination(result.data.pagination || null);
      setSeoOnPage(result.data.seoOnPage || null);
      setError(null);
    } else {
      setError(result.error || 'Không thể tải danh sách phim.');
      setMovies([]);
      setPagination(null);
    }
    setLoading(false);
  }, [defaultType, page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update filters in URL query params
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams);

      // Reset page to 1 on filter change
      params.set('page', '1');

      if (newFilters.category && !lockedCategory) params.set('category', newFilters.category);
      else if (!lockedCategory) params.delete('category');

      if (newFilters.country && !lockedCountry) params.set('country', newFilters.country);
      else if (!lockedCountry) params.delete('country');

      if (newFilters.year) params.set('year', newFilters.year);
      else params.delete('year');

      if (newFilters.lang) params.set('sort_lang', newFilters.lang);
      else params.delete('sort_lang');

      if (newFilters.sortField) params.set('sort_field', newFilters.sortField);
      else params.delete('sort_field');

      if (newFilters.sortType) params.set('sort_type', newFilters.sortType);
      else params.delete('sort_type');

      setSearchParams(params, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams, lockedCategory, lockedCountry]
  );

  // Reset all non-locked filters
  const resetAllFilters = useCallback(() => {
    updateFilters({
      category: lockedCategory || '',
      country: lockedCountry || '',
      year: '',
      lang: '',
      sortField: 'modified.time',
      sortType: 'desc',
    });
  }, [updateFilters, lockedCategory, lockedCountry]);

  // Change page
  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(newPage));
      setSearchParams(params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams]
  );

  return {
    movies,
    pagination,
    seoOnPage,
    loading,
    error,
    refetch: fetchData,
    filters,
    updateFilters,
    resetAllFilters,
    page,
    setPage,
    categories,
    countries,
  };
}
