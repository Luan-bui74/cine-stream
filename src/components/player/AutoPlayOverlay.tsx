import React, { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AutoPlayOverlayProps {
  nextEpisodeName: string;
  onConfirm: () => void;
  onCancel: () => void;
  countdownSeconds?: number;
}

export const AutoPlayOverlay: React.FC<AutoPlayOverlayProps> = ({
  nextEpisodeName,
  onConfirm,
  onCancel,
  countdownSeconds = 5,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(countdownSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onConfirm();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onConfirm]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm w-full bg-brand-surface border-2 border-brand-accent rounded-2xl p-4 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-accent text-white font-bold text-xs flex items-center justify-center animate-pulse">
            {timeLeft}s
          </div>
          <span className="font-bold text-xs text-white">Tự động phát tập tiếp</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface-light"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-brand-muted line-clamp-1">
        Chuẩn bị phát: <strong className="text-brand-accent">{nextEpisodeName}</strong>
      </p>

      <div className="flex items-center gap-2 pt-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 text-xs"
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          onClick={onConfirm}
        >
          Xem ngay ({timeLeft}s)
        </Button>
      </div>
    </div>
  );
};
