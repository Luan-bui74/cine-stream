import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Star, Eye } from 'lucide-react';
import { MovieSummary } from '../../types/movie';
import { resolveImage, formatEpisodeLabel, formatViews } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { ROUTES } from '../../lib/routes';

export interface MovieCardProps {
  movie: MovieSummary;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  const posterUrl = resolveImage(movie.poster_url);

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-brand-surface border border-brand-surface-border transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-accent/60 hover:shadow-card-hover flex flex-col h-full ${className}`}
    >
      {/* Poster Image Container */}
      <Link
        to={ROUTES.MOVIE(movie.slug)}
        className="block relative aspect-poster overflow-hidden bg-brand-surface-light"
      >
        <img
          src={posterUrl}
          alt={movie.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolveImage(null);
          }}
        />

        {/* Hover Overlay with Gradient & Quick Play Icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-accent-glow transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Badges on Poster */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {movie.quality && (
            <Badge variant="accent" className="text-[10px] py-0.5 px-2 shadow-md">
              {movie.quality}
            </Badge>
          )}
          {movie.lang && (
            <Badge variant="sub" className="text-[10px] py-0.5 px-1.5 shadow-md">
              {movie.lang}
            </Badge>
          )}
        </div>

        {/* Episode current badge on Top Right */}
        {movie.episode_current && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="dark" className="text-[10px] py-0.5 px-2 border border-brand-surface-border/60 backdrop-blur-md">
              {formatEpisodeLabel(movie.episode_current)}
            </Badge>
          </div>
        )}
      </Link>

      {/* Info Content Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-brand-surface">
        <div className="space-y-1">
          <Link
            to={ROUTES.MOVIE(movie.slug)}
            className="font-bold text-sm text-brand-text line-clamp-1 group-hover:text-brand-accent transition-colors block"
            title={movie.name}
          >
            {movie.name}
          </Link>
          <p className="text-xs text-brand-muted line-clamp-1 italic font-normal">
            {movie.origin_name}
          </p>
        </div>

        {/* Footer Meta info */}
        <div className="flex items-center justify-between text-[11px] text-brand-dim mt-3 pt-2 border-t border-brand-surface-border/40 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-dim" />
            {movie.year || 2024}
          </span>
          {typeof movie.view === 'number' && (
            <span className="flex items-center gap-1 text-brand-muted" title={`${movie.view.toLocaleString('vi-VN')} lượt xem`}>
              <Eye className="w-3 h-3 text-brand-accent/80" />
              {formatViews(movie.view)}
            </span>
          )}
          {movie.time && (
            <span className="truncate max-w-[90px] text-right" title={movie.time}>
              {movie.time}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
