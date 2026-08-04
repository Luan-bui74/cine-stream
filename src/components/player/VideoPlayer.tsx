import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import Hls from 'hls.js';
import { AlertCircle, RefreshCw, ShieldAlert, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { STORAGE_KEYS, TIMING } from '../../lib/constants';

export interface VideoPlayerProps {
  m3u8Url: string;
  embedUrl: string;
  title: string;
  slug: string;
  episodeSlug: string;
  onEnded: () => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

export interface VideoPlayerRef {
  skip: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  toggleFullscreen: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  m3u8Url,
  embedUrl,
  title,
  slug,
  episodeSlug,
  onEnded,
  onProgressUpdate,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [useFallbackIframe, setUseFallbackIframe] = useState<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [skipFeedback, setSkipFeedback] = useState<{ type: 'backward' | 'forward'; amount: number } | null>(null);
  const [showControlsOverlay, setShowControlsOverlay] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const storageProgressKey = STORAGE_KEYS.PROGRESS(slug, episodeSlug);

  // Skip logic (-10s / +10s)
  const handleSkip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime || 0;
    const duration = video.duration || 0;
    const target = Math.min(Math.max(current + seconds, 0), duration > 0 ? duration : 999999);
    video.currentTime = target;

    // Trigger visual skip feedback ripple
    setSkipFeedback({
      type: seconds < 0 ? 'backward' : 'forward',
      amount: Math.abs(seconds),
    });

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setSkipFeedback(null);
    }, 700);
  }, []);

  // Toggle container Fullscreen (Synchronous user gesture call)
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const fsElem = document.fullscreenElement || (document as any).webkitFullscreenElement;
    if (fsElem) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    } else {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    }
  }, []);

  // Expose imperative handle methods to parent
  useImperativeHandle(ref, () => ({
    skip: (seconds: number) => handleSkip(seconds),
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    getDuration: () => videoRef.current?.duration || 0,
    toggleFullscreen,
  }), [handleSkip, toggleFullscreen]);

  // Monitor Fullscreen status changes safely
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElem = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(Boolean(fsElem));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Throttle saving playback progress
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) return;

    const currentTime = Math.floor(video.currentTime);
    const duration = Math.floor(video.duration || 0);

    if (currentTime - lastSavedTimeRef.current >= TIMING.SAVE_PROGRESS_THROTTLE_SEC) {
      lastSavedTimeRef.current = currentTime;
      try {
        localStorage.setItem(
          storageProgressKey,
          JSON.stringify({ currentTime, duration })
        );
      } catch {
        // Ignore storage errors
      }
      if (onProgressUpdate && duration > 0) {
        onProgressUpdate(currentTime, duration);
      }
    }
  }, [storageProgressKey, onProgressUpdate]);

  // Restore saved playback progress
  const restoreProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const saved = localStorage.getItem(storageProgressKey);
      if (saved) {
        let seconds = 0;
        if (saved.startsWith('{')) {
          const parsed = JSON.parse(saved);
          seconds = parsed.currentTime || 0;
        } else {
          seconds = parseFloat(saved);
        }

        if (!isNaN(seconds) && seconds > 5 && seconds < (video.duration || 99999)) {
          video.currentTime = seconds;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageProgressKey]);

  // Handle double-tap gestures on mobile / touch screen
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (useFallbackIframe) return;

    const now = Date.now();
    const touch = e.touches[0];
    if (!touch || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const containerWidth = rect.width;

    const timeDiff = now - lastTapRef.current.time;
    const xDiff = Math.abs(touchX - lastTapRef.current.x);

    if (timeDiff < 300 && xDiff < 80) {
      // Double-tap detected
      if (touchX < containerWidth * 0.4) {
        // Double-tap on left side -> Rewind 10s
        handleSkip(-10);
      } else if (touchX > containerWidth * 0.6) {
        // Double-tap on right side -> Fast forward 10s
        handleSkip(10);
      }
    }

    lastTapRef.current = { time: now, x: touchX };
    triggerOverlayVisibility();
  };

  // Keyboard Shortcuts (ArrowLeft = -10s, ArrowRight = +10s, 'j' = -10s, 'l' = +10s, 'f' = Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (useFallbackIframe) return;

      // Ignore keyboard shortcuts if user is typing in an input / textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleSkip(10);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip, toggleFullscreen, useFallbackIframe]);

  // MediaSession API Integration
  useEffect(() => {
    if ('mediaSession' in navigator && !useFallbackIframe) {
      try {
        navigator.mediaSession.setActionHandler('seekbackward', () => handleSkip(-10));
        navigator.mediaSession.setActionHandler('seekforward', () => handleSkip(10));
      } catch {
        // Ignore Unsupported action handlers
      }
    }

    return () => {
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('seekbackward', null);
          navigator.mediaSession.setActionHandler('seekforward', null);
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [handleSkip, useFallbackIframe]);

  // Auto-hide controls overlay
  const triggerOverlayVisibility = useCallback(() => {
    setShowControlsOverlay(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControlsOverlay(false);
    }, 3500);
  }, []);

  // Initialize Video Player (HLS / Native)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || useFallbackIframe) return;

    setPlayerError(null);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (m3u8Url && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        restoreProgress();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setUseFallbackIframe(true);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setUseFallbackIframe(true);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && m3u8Url) {
      video.src = m3u8Url;
      video.addEventListener('loadedmetadata', () => {
        restoreProgress();
      });
      video.addEventListener('error', () => {
        setUseFallbackIframe(true);
      });
    } else {
      setUseFallbackIframe(true);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [m3u8Url, useFallbackIframe, restoreProgress]);

  const handleRetryHls = () => {
    setUseFallbackIframe(false);
    setPlayerError(null);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onMouseMove={triggerOverlayVisibility}
      className={`relative w-full rounded-2xl overflow-hidden bg-black border border-brand-surface-border shadow-2xl group select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : 'aspect-video'
      }`}
    >
      {!useFallbackIframe ? (
        <>
          <video
            ref={videoRef}
            controls
            playsInline
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={onEnded}
            onError={() => setUseFallbackIframe(true)}
          />

          {/* Quick Skip Buttons Overlay (Visible on hover/tap) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-40 flex items-center justify-between px-6 sm:px-16 ${
              showControlsOverlay ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Rewind -10s Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip(-10);
                triggerOverlayVisibility();
              }}
              title="Tua lùi 10 giây (Phím Mũi Tên Trái / J)"
              className="pointer-events-auto flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/70 hover:bg-brand-accent text-white backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-2xl focus:outline-none"
            >
              <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-[10px] sm:text-xs font-black mt-0.5">-10s</span>
            </button>

            {/* Fast Forward +10s Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip(10);
                triggerOverlayVisibility();
              }}
              title="Tua tiến 10 giây (Phím Mũi Tên Phải / L)"
              className="pointer-events-auto flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/70 hover:bg-brand-accent text-white backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-2xl focus:outline-none"
            >
              <RotateCw className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-[10px] sm:text-xs font-black mt-0.5">+10s</span>
            </button>
          </div>

          {/* Double-Tap / Skip Feedback Animation Ripple */}
          {skipFeedback && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-accent text-white font-black text-xs sm:text-base shadow-accent-glow animate-bounce ${
                skipFeedback.type === 'backward' ? 'left-8 sm:left-20' : 'right-8 sm:right-20'
              }`}
            >
              {skipFeedback.type === 'backward' ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  <span>-10 Giây</span>
                </>
              ) : (
                <>
                  <span>+10 Giây</span>
                  <RotateCw className="w-5 h-5 animate-spin" />
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          className="w-full h-full border-none"
        />
      )}

      {useFallbackIframe && (
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Đang phát qua nguồn dự phòng (Embed)</span>
        </div>
      )}

      {playerError && (
        <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-lg font-bold text-white">Không thể phát video này</h3>
          <p className="text-xs text-brand-muted max-w-md">{playerError}</p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRetryHls}
            >
              Thử lại HLS
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setUseFallbackIframe(true)}
            >
              Dùng nguồn Embed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
