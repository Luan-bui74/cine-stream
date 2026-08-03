import { useState, useEffect, useCallback, DependencyList } from 'react';
import { ApiResult } from '../types/api';

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic data fetching hook managing loading, error, data states, and manual refetch.
 *
 * @param fetcher Async API call function returning Promise<ApiResult<T>>
 * @param deps Dependency array triggering refetch on change
 */
export function useFetch<T>(
  fetcher: () => Promise<ApiResult<T>>,
  deps: DependencyList = []
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetcher();

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setData(null);
      setError(result.error);
    }

    setLoading(false);
    // eslint-disable-next-deps
  }, deps);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return {
    data,
    loading,
    error,
    refetch: executeFetch,
  };
}
