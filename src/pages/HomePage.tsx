import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, Tv, Film } from "lucide-react";

import { useFetch } from "../hooks/useFetch";
import { getNewMovies, getMoviesByType, getCategories } from "../api";

import { HeroCarousel } from "../components/home/HeroCarousel";
import { MovieGrid } from "../components/movie/MovieGrid";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { ROUTES } from "../lib/routes";
import { PAGINATION_LIMITS } from "../lib/constants";
import { Category } from "../types/movie";

export const HomePage: React.FC = () => {
  // 1. Fetch Hero / Newest Movies
  const newMoviesFetch = useFetch(() => getNewMovies(1), []);

  // 2. Fetch Category List for Chips Bar
  const categoriesFetch = useFetch(() => getCategories(), []);

  // 3. Fetch Phim Bộ
  const seriesFetch = useFetch(
    () =>
      getMoviesByType("phim-bo", {
        sort_field: "modified.time",
        sort_type: "desc",
        limit: PAGINATION_LIMITS.HOME_SECTION,
      }),
    [],
  );

  // 4. Fetch Phim Lẻ
  const singlesFetch = useFetch(
    () =>
      getMoviesByType("phim-le", {
        sort_field: "modified.time",
        sort_type: "desc",
        limit: PAGINATION_LIMITS.HOME_SECTION,
      }),
    [],
  );

  // 5. Fetch Hoạt Hình
  const animeFetch = useFetch(
    () =>
      getMoviesByType("hoat-hinh", {
        sort_field: "modified.time",
        sort_type: "desc",
        limit: PAGINATION_LIMITS.HOME_SECTION,
      }),
    [],
  );

  // 6. Fetch TV Shows
  const tvShowsFetch = useFetch(
    () =>
      getMoviesByType("tv-shows", {
        sort_field: "modified.time",
        sort_type: "desc",
        limit: PAGINATION_LIMITS.HOME_SECTION,
      }),
    [],
  );

  const heroMovies = newMoviesFetch.data?.items
    ? newMoviesFetch.data.items.slice(0, 8)
    : [];
  const latestMovies = newMoviesFetch.data?.items
    ? newMoviesFetch.data.items.slice(0, PAGINATION_LIMITS.HOME_NEW)
    : [];
  const seriesMovies = seriesFetch.data?.items
    ? seriesFetch.data.items.slice(0, PAGINATION_LIMITS.HOME_SECTION)
    : [];
  const singleMovies = singlesFetch.data?.items
    ? singlesFetch.data.items.slice(0, PAGINATION_LIMITS.HOME_SECTION)
    : [];
  const animeMovies = animeFetch.data?.items
    ? animeFetch.data.items.slice(0, PAGINATION_LIMITS.HOME_SECTION)
    : [];
  const tvShowsMovies = tvShowsFetch.data?.items
    ? tvShowsFetch.data.items.slice(0, PAGINATION_LIMITS.HOME_SECTION)
    : [];

  // Filter categories safely with defensive array checks
  const displayCategories = useMemo<Category[]>(() => {
    const rawData = categoriesFetch.data;
    const allCategories: Category[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray((rawData as any)?.items)
        ? (rawData as any).items
        : [];

    const popularSlugs = [
      "hanh-dong",
      "tinh-cam",
      "co-trang",
      "vien-tuong",
      "hai-huoc",
      "tam-ly",
      "vo-thuat",
      "kinh-di",
      "hoat-hinh",
    ];
    const popular = allCategories.filter(
      (c: Category) => c && c.slug && popularSlugs.includes(c.slug),
    );
    return popular.length > 0
      ? popular.slice(0, 12)
      : allCategories.slice(0, 12);
  }, [categoriesFetch.data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
      {/* 1. Hero / Banner Carousel Section */}
      {heroMovies.length > 0 && <HeroCarousel movies={heroMovies} />}

      {/* 2. Featured Category Chips Bar */}
      <div id="the-loai" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dim flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent" /> Thể Loại Nổi Bật
          </h3>
        </div>
        {categoriesFetch.loading ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-brand-surface-light rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {displayCategories.map((cat: Category) => (
              <Link key={cat._id || cat.slug} to={ROUTES.CATEGORY(cat.slug)}>
                <Chip
                  active={false}
                  className="hover:border-brand-accent transition-colors"
                >
                  {cat.name}
                </Chip>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 6. Section "Anime & Hoạt Hình" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-surface-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
              Anime &amp; Phim Hoạt Hình
            </h2>
          </div>
          <Link to={ROUTES.LIST("hoat-hinh")}>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <MovieGrid
          items={animeMovies}
          loading={animeFetch.loading}
          skeletonCount={PAGINATION_LIMITS.HOME_SECTION}
        />
      </section>

      {/* 3. Section "Phim mới cập nhật" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-surface-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
              Phim Mới Cập Nhật
            </h2>
          </div>
          <Link to={ROUTES.LIST("phim-moi-cap-nhat")}>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <MovieGrid
          items={latestMovies}
          loading={newMoviesFetch.loading}
          skeletonCount={PAGINATION_LIMITS.HOME_NEW}
        />
      </section>

      {/* 4. Section "Phim Bộ mới" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-surface-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
              Phim Bộ Mới Chọn Lọc
            </h2>
          </div>
          <Link to={ROUTES.LIST("phim-bo")}>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <MovieGrid
          items={seriesMovies}
          loading={seriesFetch.loading}
          skeletonCount={PAGINATION_LIMITS.HOME_SECTION}
        />
      </section>

      {/* 5. Section "Phim Lẻ Chiếu Rạp" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-surface-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
              Phim Lẻ Chiếu Rạp Mới
            </h2>
          </div>
          <Link to={ROUTES.LIST("phim-le")}>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <MovieGrid
          items={singleMovies}
          loading={singlesFetch.loading}
          skeletonCount={PAGINATION_LIMITS.HOME_SECTION}
        />
      </section>

      {/* 7. Section "TV Shows" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-surface-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
              TV Shows &amp; Truyền Hình
            </h2>
          </div>
          <Link to={ROUTES.LIST("tv-shows")}>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <MovieGrid
          items={tvShowsMovies}
          loading={tvShowsFetch.loading}
          skeletonCount={PAGINATION_LIMITS.HOME_SECTION}
        />
      </section>
    </div>
  );
};
