import React from 'react';
import { Server } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ServerTabsProps {
  servers: string[];
  activeServer: string;
  onChange: (server: string) => void;
}

export const ServerTabs: React.FC<ServerTabsProps> = ({
  servers,
  activeServer,
  onChange,
}) => {
  if (!servers || servers.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium pr-2 border-r border-brand-surface-border flex-shrink-0">
        <Server className="w-4 h-4 text-brand-accent" />
        <span>Nguồn phát:</span>
      </div>
      <div className="flex items-center gap-2">
        {servers.map((server) => {
          const isActive = activeServer === server;
          return (
            <button
              key={server}
              onClick={() => onChange(server)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer select-none',
                isActive
                  ? 'bg-brand-accent text-white border-brand-accent shadow-accent-glow'
                  : 'bg-brand-surface text-brand-muted border-brand-surface-border hover:text-brand-text hover:bg-brand-surface-light'
              )}
            >
              {server}
            </button>
          );
        })}
      </div>
    </div>
  );
};
