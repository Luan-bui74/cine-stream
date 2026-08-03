import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-none">
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border backdrop-blur-md',
          type === 'success'
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
            : 'bg-red-950/90 text-red-200 border-red-500/40'
        )}
      >
        {type === 'success' ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-400" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};
