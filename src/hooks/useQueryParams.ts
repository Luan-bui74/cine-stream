import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to access and parse URL search query parameters easily
 */
export function useQueryParams(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
