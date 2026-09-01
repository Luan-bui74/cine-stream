import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  ListVideo,
  Play,
  Check,
  RotateCcw,
  RotateCw,
  Eye,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { getMovieDetail } from '../api';
import { useAppStore } from '../store/AppContext';
import { resolveImage, formatViews } from '../lib/utils';
import { ServerDataItem } from '../types/movie';
import { ROUTES } from '../lib/routes';

import { Breadcrumb } from '../components/shared/Breadcrumb';
import { VideoPlayer, VideoPlayerRef } from '../components/player/VideoPlayer';
import { AutoPlayOverlay } from '../components/player/AutoPlayOverlay';
import { ServerTabs } from '../components/movie/ServerTabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { Spinner } from '../components/ui/Spinner';
import { SEO, stripHtml } from '../components/shared/SEO';

export const WatchPage: React.FC = () => {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug?: string }>();
  const movieSlug = slug || '';
  const navigate = useNavigate();

  const playerRef = useRef<VideoPlayerRef>(null);
  const [activeServerIdx, setActiveServerIdx] = useState(0);
  const [showAutoPlayOverlay, setShowAutoPlayOverlay] = useState(false);

  const { addWatchHistory, watchHistory } = useAppStore();

  // Fetch movie details
  const { data: detailData, loading, error, refetch } = useFetch(
    () => getMovieDetail(movieSlug),
    [movieSlug]
  );

  const movie = detailData?.movie;
  const episodes = detailData?.episodes || [];

  const currentServerGroup = episodes[activeServerIdx] || episodes[0];
  const serverDataList: ServerDataItem[] = currentServerGroup?.server_data || [];

  // Find active episode item by episodeSlug
  const currentEpisodeIdx = useMemo(() => {
    if (!episodeSlug || serverDataList.length === 0) return 0;
    const idx = serverDataList.findIndex(
      (ep) => ep.slug === episodeSlug || ep.name === episodeSlug
    );
    return idx !== -1 ? idx : 0;
  }, [episodeSlug, serverDataList]);

  const currentEpisode = serverDataList[currentEpisodeIdx] || serverDataList[0];

  // Auto redirect if episodeSlug is invalid or missing
  useEffect(() => {
    if (!loading && movie && serverDataList.length > 0) {
      if (!episodeSlug || !serverDataList.some((ep) => ep.slug === episodeSlug)) {
        const firstSlug = serverDataList[0]?.slug || '1';
        navigate(ROUTES.WATCH(movieSlug, firstSlug), { replace: true });
      }
    }
  }, [loading, movie, episodeSlug, serverDataList, movieSlug, navigate]);

  // Record / update Watch History in Context
  useEffect(() => {
    if (movie && currentEpisode) {
      addWatchHistory({
        _id: movie._id,
        name: movie.name,
        slug: movie.slug,
        poster_url: movie.poster_url,
        episodeName: currentEpisode.name.toLowerCase().includes('tập')
          ? currentEpisode.name
          : `Tập ${currentEpisode.name}`,
        episodeSlug: currentEpisode.slug,
        serverName: currentServerGroup?.server_name || 'Server 1',
      });
    }
  }, [movie, currentEpisode, currentServerGroup, addWatchHistory]);

  // Watched slugs set for checkmarks
  const watchedSlugs = useMemo(() => {
    return watchHistory.filter((h) => h.slug === movieSlug).map((h) => h.episodeSlug);
  }, [watchHistory, movieSlug]);

  // Navigation helpers for Prev / Next episodes
  const prevEpisode = currentEpisodeIdx > 0 ? serverDataList[currentEpisodeIdx - 1] : null;
  const nextEpisode =
    currentEpisodeIdx < serverDataList.length - 1
      ? serverDataList[currentEpisodeIdx + 1]
      : null;

  const handleSelectEpisode = useCallback(
    (ep: ServerDataItem) => {
      setShowAutoPlayOverlay(false);
      navigate(ROUTES.WATCH(movieSlug, ep.slug));
    },
    [movieSlug, navigate]
  );

  const handleNextEpisodeClick = useCallback(() => {
    if (nextEpisode) {
      handleSelectEpisode(nextEpisode);
    }
  }, [nextEpisode, handleSelectEpisode]);

  const handlePrevEpisodeClick = useCallback(() => {
    if (prevEpisode) {
      handleSelectEpisode(prevEpisode);
    }
  }, [prevEpisode, handleSelectEpisode]);

  // SEO document title
  useEffect(() => {
    if (movie && currentEpisode) {
      const epName = currentEpisode.name.toLowerCase().includes('tập')
        ? currentEpisode.name
        : `Tập ${currentEpisode.name}`;
      document.title = `Xem phim ${movie.name} - ${epName} Vietsub HD | CineStream`;
    }
  }, [movie, currentEpisode]);

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="h-6 w-64 bg-brand-surface-light rounded animate-pulse" />
        <div className="aspect-video w-full rounded-2xl bg-brand-surface border border-brand-surface-border flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="Không thể tải trình phát video"
          message={error || 'Bộ phim không tồn tại.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const epTitle = currentEpisode
    ? currentEpisode.name.toLowerCase().includes('tập')
      ? currentEpisode.name
      : `Tập ${currentEpisode.name}`
    : 'Tập 1';

  const posterUrl = resolveImage(movie.poster_url);
  const cleanDescription = `Xem phim ${movie.name} (${movie.origin_name}) ${epTitle} vietsub thuyết minh Full HD nhanh nhất trên CineStream. ${stripHtml(movie.content).slice(0, 150)}...`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <SEO
        title={`Xem Phim ${movie.name} - ${epTitle} Vietsub HD`}
        description={cleanDescription}
        keywords={`${movie.name}, xem ${movie.name} ${epTitle}, ${epTitle} ${movie.name}, phim ${movie.name} vietsub`}
        image={posterUrl}
        type="video.episode"
        schema={{
          '@type': 'VideoObject',
          name: `${movie.name} - ${epTitle}`,
          description: cleanDescription,
          thumbnailUrl: [posterUrl],
          uploadDate: movie.modified?.time || `${movie.year}-01-01`,
        }}
      />

      {/* 5s Auto Play Next Overlay */}
      {showAutoPlayOverlay && nextEpisode && (
        <AutoPlayOverlay
          nextEpisodeName={nextEpisode.name}
          onConfirm={() => {
            setShowAutoPlayOverlay(false);
            handleNextEpisodeClick();
          }}
          onCancel={() => setShowAutoPlayOverlay(false)}
        />
      )}

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: movie.name, href: ROUTES.MOVIE(movie.slug) },
          { label: epTitle },
        ]}
      />

      {/* Player Section Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Video Player Area (Col 1-3) */}
        <div className="lg:col-span-3 space-y-4">
          {/* VIDEO PLAYER */}
          {currentEpisode ? (
            <VideoPlayer
              ref={playerRef}
              key={`${currentEpisode.slug}-${activeServerIdx}`}
              m3u8Url={currentEpisode.link_m3u8}
              embedUrl={currentEpisode.link_embed}
              title={`${movie.name} - ${epTitle}`}
              slug={movie.slug}
              episodeSlug={currentEpisode.slug}
              onEnded={() => {
                if (nextEpisode) {
                  setShowAutoPlayOverlay(true);
                }
              }}
            />
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-black flex items-center justify-center text-brand-muted">
              Không tìm thấy link video cho tập này.
            </div>
          )}

          {/* Player Bar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-surface border border-brand-surface-border p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Skip -10s Button */}
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => playerRef.current?.skip(-10)}
                title="Tua lùi 10 giây (Phím Mũi Tên Trái / J)"
              >
                -10s
              </Button>

              {/* Prev Episode Button */}
              <Button
                variant="secondary"
                size="sm"
                disabled={!prevEpisode}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={handlePrevEpisodeClick}
              >
                Tập trước
              </Button>

              {/* Next Episode Button */}
              <Button
                variant="primary"
                size="sm"
                disabled={!nextEpisode}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={handleNextEpisodeClick}
              >
                Tập sau
              </Button>

              {/* Skip +10s Button */}
              <Button
                variant="outline"
                size="sm"
                rightIcon={<RotateCw className="w-4 h-4" />}
                onClick={() => playerRef.current?.skip(10)}
                title="Tua tiến 10 giây (Phím Mũi Tên Phải / L)"
              >
                +10s
              </Button>
            </div>

            {/* Server Tabs */}
            {episodes.length > 1 && (
              <ServerTabs
                servers={episodes.map((s, i) => s.server_name || `Server ${i + 1}`)}
                activeServer={episodes[activeServerIdx]?.server_name || ''}
                onChange={(serverName) => {
                  const idx = episodes.findIndex((s) => s.server_name === serverName);
                  if (idx !== -1) setActiveServerIdx(idx);
                }}
              />
            )}
          </div>

          {/* Movie Snapshot Info */}
          <div className="bg-brand-surface border border-brand-surface-border p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={resolveImage(movie.poster_url)}
                alt={movie.name}
                className="w-14 h-20 object-cover rounded-xl border border-brand-surface-border"
              />
              <div className="space-y-1">
                <h1 className="font-extrabold text-base text-brand-text">{movie.name}</h1>
                <p className="text-xs text-brand-muted italic">{movie.origin_name}</p>
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  <Badge variant="accent">{epTitle}</Badge>
                  {movie.quality && <Badge variant="dark">{movie.quality}</Badge>}
                  {typeof movie.view === "number" && (
                    <Badge variant="dark" className="text-xs">
                      <Eye className="w-3 h-3 mr-1 text-brand-accent inline" />
                      {formatViews(movie.view)} lượt xem
                    </Badge>
                  )}
                  <span className="text-xs text-brand-dim flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {movie.year}
                  </span>
                </div>
              </div>
            </div>

            <Link to={ROUTES.MOVIE(movie.slug)}>
              <Button variant="outline" size="sm" leftIcon={<Info className="w-4 h-4" />}>
                Xem thông tin đầy đủ
              </Button>
            </Link>
          </div>
        </div>

        {/* Up Next Episodes Sidebar */}
        <div className="bg-brand-surface border border-brand-surface-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-surface-border">
            <ListVideo className="w-4 h-4 text-brand-accent" />
            <h3 className="font-bold text-sm text-brand-text">Danh Sách Tập Phim</h3>
          </div>

          <div className="grid grid-cols-4 lg:grid-cols-3 gap-2 max-h-[520px] overflow-y-auto pr-1">
            {serverDataList.map((ep, idx) => {
              const isActive = idx === currentEpisodeIdx;
              const isWatched = watchedSlugs.includes(ep.slug);

              return (
                <button
                  key={ep.slug || idx}
                  onClick={() => handleSelectEpisode(ep)}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all text-center truncate border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    isActive
                      ? 'bg-brand-accent text-white border-brand-accent shadow-accent-glow'
                      : isWatched
                      ? 'bg-brand-surface-light text-emerald-300 border-emerald-500/40 hover:border-brand-accent'
                      : 'bg-brand-surface-light text-brand-muted border-brand-surface-border hover:border-brand-accent/50 hover:text-brand-text'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <Play className="w-3 h-3 fill-current" />
                    ) : isWatched ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : null}
                    <span>{ep.name.toLowerCase().includes('tập') ? ep.name : `Tập ${ep.name}`}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
