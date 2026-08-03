import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { STORAGE_KEYS, TIMING } from '../../lib/constants';

/**
 * TODO: Severe CORS & Referer Restriction Warning
 * Many third-party m3u8 video streams enforce strict HTTP Referer and Origin header checks.
 * In a real production environment, calling direct m3u8 URLs from client browsers may produce CORS errors.
 * Solution: Deploy a backend proxy route (e.g., /api/stream?url=...) to stream m3u8 chunks with correct origin headers.
 */

export interface VideoPlayerProps {
  m3u8Url: string;
  embedUrl: string;
  title: string;
  slug: string;
  episodeSlug: string;
  onEnded: () => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  m3u8Url,
  embedUrl,
  title,
  slug,
  episodeSlug,
  onEnded,
  onProgressUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastSavedTimeRef = useRef<number>(0);

  const [useFallbackIframe, setUseFallbackIframe] = useState<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const storageProgressKey = STORAGE_KEYS.PROGRESS(slug, episodeSlug);

  // Throttle saving playback progress (currentTime & duration) to localStorage
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

  // Initialize Video Player
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
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-brand-surface-border shadow-2xl group">
      {!useFallbackIframe ? (
        <video
          ref={videoRef}
          controls
          playsInline
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          onError={() => setUseFallbackIframe(true)}
        />
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
};
