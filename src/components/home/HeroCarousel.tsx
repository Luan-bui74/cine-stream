import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, Calendar, Info } from 'lucide-react';
import { MovieSummary } from '../../types/movie';
import { resolveImage, formatEpisodeLabel } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ROUTES } from '../../lib/routes';
import { TIMING } from '../../lib/constants';

export interface HeroCarouselProps {
  movies: MovieSummary[];
  autoSlideInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  movies,
  autoSlideInterval = TIMING.AUTO_SLIDE_INTERVAL_MS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const displayMovies = movies.slice(0, 8);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayMovies.length);
  }, [displayMovies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayMovies.length) % displayMovies.length);
  }, [displayMovies.length]);

  useEffect(() => {
    if (isPaused || displayMovies.length <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, displayMovies.length, autoSlideInterval, nextSlide]);

  if (!movies || displayMovies.length === 0) return null;

  const currentMovie = displayMovies[currentIndex];
  const backdropUrl = resolveImage(currentMovie.thumb_url || currentMovie.poster_url);

  return (
    <div
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[520px] rounded-3xl overflow-hidden bg-brand-surface border border-brand-surface-border shadow-2xl group my-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Banner */}
      <img
        src={backdropUrl}
        alt={currentMovie.name}
        loading={currentIndex === 0 ? 'eager' : 'lazy'}
        // @ts-expect-error fetchpriority attribute
        fetchpriority={currentIndex === 0 ? 'high' : 'auto'}
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] transition-all duration-700 scale-105 group-hover:scale-100"
        onError={(e) => {
          (e.target as HTMLImageElement).src = resolveImage(null);
        }}
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/95 via-brand-bg/50 to-transparent hidden sm:block" />

      {/* Content Container */}
      <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-3xl space-y-3 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          {currentMovie.quality && <Badge variant="accent">{currentMovie.quality}</Badge>}
          {currentMovie.lang && <Badge variant="sub">{currentMovie.lang}</Badge>}
          {currentMovie.episode_current && (
            <Badge variant="dark">{formatEpisodeLabel(currentMovie.episode_current)}</Badge>
          )}
          <span className="text-xs font-semibold text-brand-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-accent" /> {currentMovie.year || 2024}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight line-clamp-1 drop-shadow-md">
          {currentMovie.name}
        </h2>

        <p className="text-xs sm:text-sm text-brand-muted font-medium italic line-clamp-1">
          {currentMovie.origin_name}
        </p>

        {/* Action CTA Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Link to={ROUTES.MOVIE(currentMovie.slug)}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Xem ngay
            </Button>
          </Link>
          <Link to={ROUTES.MOVIE(currentMovie.slug)}>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Info className="w-4 h-4" />}
            >
              Chi tiết
            </Button>
          </Link>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      {displayMovies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Slide trước"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-accent hover:scale-110 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide sau"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-accent hover:scale-110 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {displayMovies.length > 1 && (
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5">
          {displayMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Chuyển tới slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-brand-accent' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
