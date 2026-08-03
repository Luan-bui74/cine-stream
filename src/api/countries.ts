import { getCountries, getMoviesByType } from './index';

export { getCountries };

export async function getMoviesByCountry(countrySlug: string, page: number = 1) {
  return getMoviesByType('phim-bo', { country: countrySlug, page });
}
