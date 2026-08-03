import { getCategories, getMoviesByType } from './index';

export { getCategories };

export async function getMoviesByCategory(categorySlug: string, page: number = 1) {
  return getMoviesByType('phim-bo', { category: categorySlug, page });
}
