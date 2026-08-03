import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WatchHistoryItem } from '../types/movie';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '../lib/constants';

interface HistoryContextType {
  history: WatchHistoryItem[];
  addHistoryItem: (item: Omit<WatchHistoryItem, 'timestamp'>) => void;
  updateHistoryProgress: (
    slug: string,
    episodeSlug: string,
    currentTime: number,
    duration: number
  ) => void;
  removeHistoryItem: (slug: string, episodeSlug?: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useLocalStorage<WatchHistoryItem[]>(
    STORAGE_KEYS.WATCH_HISTORY,
    []
  );

  const addHistoryItem = useCallback(
    (item: Omit<WatchHistoryItem, 'timestamp'>) => {
      setHistory((prev) => {
        const filtered = prev.filter(
          (h) => !(h.slug === item.slug && h.episodeSlug === item.episodeSlug)
        );
        return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      });
    },
    [setHistory]
  );

  const updateHistoryProgress = useCallback(
    (slug: string, episodeSlug: string, currentTime: number, duration: number) => {
      setHistory((prev) => {
        return prev.map((item) => {
          if (item.slug === slug && item.episodeSlug === episodeSlug) {
            return {
              ...item,
              progressSeconds: currentTime,
              durationSeconds: duration,
              timestamp: Date.now(),
            };
          }
          return item;
        });
      });
    },
    [setHistory]
  );

  const removeHistoryItem = useCallback(
    (slug: string, episodeSlug?: string) => {
      setHistory((prev) =>
        prev.filter((h) => {
          if (episodeSlug) {
            return !(h.slug === slug && h.episodeSlug === episodeSlug);
          }
          return h.slug !== slug;
        })
      );
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistoryItem,
        updateHistoryProgress,
        removeHistoryItem,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
