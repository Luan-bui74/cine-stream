import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Play,
  Heart,
  Share2,
  Star,
  Film,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Clapperboard,
  Sparkles,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { getMovieDetail, getMoviesByType, getNewMovies } from "../api";
import { resolveImage, formatEpisodeLabel } from "../lib/utils";
import { useAppStore } from "../store/AppContext";
import { ROUTES } from "../lib/routes";
import { PAGINATION_LIMITS } from "../lib/constants";

import { Breadcrumb } from "../components/shared/Breadcrumb";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { MovieGrid } from "../components/movie/MovieGrid";
import { ServerTabs } from "../components/movie/ServerTabs";
import { EpisodeSelector } from "../components/movie/EpisodeSelector";
import { ErrorState } from "../components/ui/ErrorState";
import { Toast } from "../components/ui/Toast";

export const MovieDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const movieSlug = slug || "";
  const navigate = useNavigate();

  const [expandedContent, setExpandedContent] = useState(false);
  const [activeServerIdx, setActiveServerIdx] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isBookmarked, toggleBookmark, watchHistory } = useAppStore();

  // Fetch movie detail
  const {
    data: detailData,
    loading,
    error,
    refetch,
  } = useFetch(() => getMovieDetail(movieSlug), [movieSlug]);

  const movie = detailData?.movie;
  const episodes = detailData?.episodes || [];

  // Check watch history for resume playback feature
  const lastWatchedItem = useMemo(() => {
    return watchHistory.find((h) => h.slug === movieSlug);
  }, [watchHistory, movieSlug]);

  const watchedSlugs = useMemo(() => {
    return watchHistory
      .filter((h) => h.slug === movieSlug)
      .map((h) => h.episodeSlug);
  }, [watchHistory, movieSlug]);

  // Fetch related movies based on first category
  const firstCatSlug = movie?.category?.[0]?.slug || "hanh-dong";
  const relatedFetch = useFetch(
    () =>
      getMoviesByType("phim-bo", {
        category: firstCatSlug,
        limit: PAGINATION_LIMITS.RELATED + 1,
      }),
    [firstCatSlug],
  );

  // Fetch fallback recommended movies for 404 screen
  const recommendFetch = useFetch(() => getNewMovies(1), []);

  const relatedMovies = useMemo(() => {
    if (!relatedFetch.data?.items) return [];
    return relatedFetch.data.items
      .filter((m) => m.slug !== movieSlug)
      .slice(0, PAGINATION_LIMITS.RELATED);
  }, [relatedFetch.data, movieSlug]);

  // SEO Document Title
  useEffect(() => {
    if (movie) {
      document.title = `${movie.name} (${movie.origin_name}) - Xem phim Vietsub HD`;
    }
  }, [movie]);

  // Handle Copy share link
  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("Đã sao chép liên kết vào bộ nhớ tạm!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Không thể sao chép liên kết.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Determine Primary CTA Button Text & Target Episode
  const primaryCTA = useMemo(() => {
    if (!episodes || episodes.length === 0) {
      return { text: "Xem Phim", targetSlug: "tap-1" };
    }
    const currentServer = episodes[activeServerIdx] || episodes[0];
    const serverData = currentServer?.server_data || [];

    if (lastWatchedItem) {
      return {
        text: `Xem tiếp ${lastWatchedItem.episodeName || "Tập"}`,
        targetSlug: lastWatchedItem.episodeSlug,
      };
    }

    const firstEp = serverData[0];
    return {
      text:
        serverData.length === 1
          ? "Xem Phim Ngay"
          : `Xem ${firstEp?.name || "Tập 1"}`,
      targetSlug: firstEp?.slug || "1",
    };
  }, [episodes, activeServerIdx, lastWatchedItem]);

  // BOOKMARK STATE
  const bookmarked = movie ? isBookmarked(movie.slug) : false;

  // 1. MOVIE NOT FOUND / 404 STATE
  if (!loading && (!detailData?.status || !movie)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col items-center justify-center text-center p-12 bg-brand-surface border border-brand-surface-border rounded-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-surface-light border border-brand-surface-border flex items-center justify-center text-brand-accent">
            <Film className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
            Phim Không Tồn Tại
          </h1>
          <p className="text-sm text-brand-muted max-w-md">
            Bộ phim bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ
            thống.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Link to={ROUTES.HOME}>
              <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
                Về Trang Chủ
              </Button>
            </Link>
          </div>
        </div>

        {/* Recommended Movies */}
        {recommendFetch.data?.items && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-accent" /> Gợi Ý Phim Mới
              Khác
            </h3>
            <MovieGrid
              items={recommendFetch.data.items.slice(
                0,
                PAGINATION_LIMITS.RECOMMENDED_404,
              )}
            />
          </div>
        )}
      </div>
    );
  }

  // 2. LOADING SKELETON STATE
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-pulse">
        <div className="h-6 w-64 bg-brand-surface-light rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="aspect-poster w-full bg-brand-surface-light rounded-2xl" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-brand-surface-light rounded-lg w-3/4" />
            <div className="h-5 bg-brand-surface-light rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-brand-surface-light rounded" />
              <div className="h-6 w-16 bg-brand-surface-light rounded" />
            </div>
            <div className="h-24 bg-brand-surface-light rounded-xl w-full" />
            <div className="flex gap-3">
              <div className="h-12 w-36 bg-brand-surface-light rounded-xl" />
              <div className="h-12 w-36 bg-brand-surface-light rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. ERROR STATE
  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="Không thể tải thông tin phim"
          message={error || "Đã có lỗi xảy ra."}
          onRetry={refetch}
        />
      </div>
    );
  }

  const backdropUrl = resolveImage(movie.thumb_url || movie.poster_url);
  const posterUrl = resolveImage(movie.poster_url);

  // Rating Display Logic
  const ratingScore = movie.tmdb?.vote_average || 0;

  return (
    <div className="relative space-y-8 pb-12">
      {/* Toast Alert */}
      <Toast message={toastMessage || ""} visible={Boolean(toastMessage)} />

      {/* Hero Backdrop Banner */}
      <div className="relative w-full min-h-[300px] sm:min-h-[420px] overflow-hidden -mt-20 pt-20">
        <img
          src={backdropUrl}
          alt={movie.name}
          className="absolute inset-0 w-full h-full object-cover filter  brightness-[0.9] scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/85 to-transparent" />
      </div>

      {/* Main Detail Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-64 relative z-10 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: movie.name }]} />

        {/* 2-Column Detail Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {/* Left Column: Poster Card */}
          <div className="flex flex-col items-center sm:items-start space-y-3">
            <div className="relative aspect-poster w-full max-w-[280px] sm:max-w-none rounded-2xl overflow-hidden bg-brand-surface border-2 border-brand-surface-border shadow-2xl">
              <img
                src={posterUrl}
                alt={movie.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = resolveImage(null);
                }}
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {movie.quality && (
                  <Badge variant="accent">{movie.quality}</Badge>
                )}
                {movie.lang && <Badge variant="sub">{movie.lang}</Badge>}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-brand-text tracking-tight">
                {movie.name}
              </h1>
              <p className="text-sm sm:text-base font-medium text-brand-muted italic mt-1">
                {movie.origin_name}
              </p>
            </div>

            {/* Badges & Rating */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="dark" className="px-2.5 py-1 text-xs">
                <Calendar className="w-3 h-3 mr-1 inline" />{" "}
                {movie.year || 2024}
              </Badge>
              {movie.time && (
                <Badge variant="dark" className="px-2.5 py-1 text-xs">
                  <Clock className="w-3 h-3 mr-1 inline" /> {movie.time}
                </Badge>
              )}
              {movie.episode_current && (
                <Badge variant="accent" className="px-2.5 py-1 text-xs">
                  {formatEpisodeLabel(movie.episode_current)}
                </Badge>
              )}
              {ratingScore > 0 && (
                <Badge variant="gold" className="px-2.5 py-1 text-xs">
                  <Star className="w-3.5 h-3.5 mr-1 fill-current inline" />
                  {ratingScore.toFixed(1)} / 10 IMDb
                </Badge>
              )}
            </div>

            {/* Category Chips */}
            {movie.category && movie.category.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs text-brand-dim font-medium mr-1">
                  Thể loại:
                </span>
                {movie.category.map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    to={ROUTES.CATEGORY(cat.slug)}
                  >
                    <Chip
                      active={false}
                      className="hover:border-brand-accent text-xs"
                    >
                      {cat.name}
                    </Chip>
                  </Link>
                ))}
              </div>
            )}

            {/* Country Chips */}
            {movie.country && movie.country.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-brand-dim font-medium mr-1">
                  Quốc gia:
                </span>
                {movie.country.map((c) => (
                  <Link key={c._id || c.slug} to={ROUTES.COUNTRY(c.slug)}>
                    <Chip
                      active={false}
                      className="hover:border-brand-accent text-xs"
                    >
                      {c.name}
                    </Chip>
                  </Link>
                ))}
              </div>
            )}

            {/* Cast & Director */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-muted bg-brand-surface border border-brand-surface-border p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-brand-accent flex-shrink-0" />
                <span className="truncate">
                  <strong className="text-brand-text">Đạo diễn:</strong>{" "}
                  {movie.director?.join(", ") || "Đang cập nhật"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-accent flex-shrink-0" />
                <span className="truncate">
                  <strong className="text-brand-text">Diễn viên:</strong>{" "}
                  {movie.actor?.join(", ") || "Đang cập nhật"}
                </span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to={ROUTES.WATCH(movie.slug, primaryCTA.targetSlug)}>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Play className="w-5 h-5 fill-current" />}
                >
                  {primaryCTA.text}
                </Button>
              </Link>

              <Button
                variant={bookmarked ? "secondary" : "outline"}
                size="lg"
                leftIcon={
                  <Heart
                    className={`w-5 h-5 ${bookmarked ? "fill-brand-accent text-brand-accent" : ""}`}
                  />
                }
                onClick={() =>
                  toggleBookmark({
                    _id: movie._id,
                    name: movie.name,
                    slug: movie.slug,
                    poster_url: movie.poster_url,
                    year: movie.year,
                    quality: movie.quality,
                  })
                }
              >
                {bookmarked ? "Đã yêu thích" : "Thêm vào Yêu thích"}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                leftIcon={<Share2 className="w-5 h-5" />}
                onClick={handleShare}
              >
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable Movie Content / Synopsis */}
        {movie.content && (
          <div className="bg-brand-surface border border-brand-surface-border p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-sm text-brand-text">Nội Dung Phim</h3>
            <p
              className={`text-xs sm:text-sm text-brand-muted leading-relaxed transition-all ${
                expandedContent ? "" : "line-clamp-4"
              }`}
            >
              {movie.content.replace(/<[^>]*>?/gm, "")}
            </p>
            <button
              onClick={() => setExpandedContent(!expandedContent)}
              className="flex items-center gap-1 text-xs text-brand-accent font-semibold hover:underline cursor-pointer pt-1"
            >
              <span>{expandedContent ? "Thu gọn" : "Xem thêm nội dung"}</span>
              {expandedContent ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Server & Episode Selector */}
        {episodes.length > 0 && (
          <div className="space-y-4">
            {episodes.length > 1 && (
              <ServerTabs
                servers={episodes.map(
                  (s, i) => s.server_name || `Server ${i + 1}`,
                )}
                activeServer={episodes[activeServerIdx]?.server_name || ""}
                onChange={(serverName) => {
                  const idx = episodes.findIndex(
                    (s) => s.server_name === serverName,
                  );
                  if (idx !== -1) setActiveServerIdx(idx);
                }}
              />
            )}

            <EpisodeSelector
              episodes={[episodes[activeServerIdx] || episodes[0]]}
              watchedSlugs={watchedSlugs}
              onSelect={(ep) => navigate(ROUTES.WATCH(movie.slug, ep.slug))}
            />
          </div>
        )}

        {/* Section: Có thể bạn thích */}
        {relatedMovies.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-brand-surface-border/50">
            <h3 className="text-xl font-extrabold text-brand-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-accent" /> Có Thể Bạn
              Thích
            </h3>
            <MovieGrid
              items={relatedMovies}
              loading={relatedFetch.loading}
              skeletonCount={PAGINATION_LIMITS.RELATED}
            />
          </div>
        )}
      </div>
    </div>
  );
};
