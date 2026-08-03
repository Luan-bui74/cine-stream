import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BookmarkItem, WatchHistoryItem } from '../types/movie';
import { STORAGE_KEYS } from '../lib/constants';
import { FavoritesProvider, useFavorites } from './FavoritesContext';
import { HistoryProvider, useHistory } from './HistoryContext';

export type ThemeMode = 'dark' | 'light';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  bookmarks: BookmarkItem[];
  watchHistory: WatchHistoryItem[];
  toggleBookmark: (item: Omit<BookmarkItem, 'addedAt'>) => void;
  isBookmarked: (slug: string) => boolean;
  addWatchHistory: (item: Omit<WatchHistoryItem, 'timestamp'>) => void;
  clearWatchHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeMode>(
    STORAGE_KEYS.THEME_MODE,
    'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return (
    <FavoritesProvider>
      <HistoryProvider>
        <AppContent theme={theme} toggleTheme={toggleTheme}>
          {children}
        </AppContent>
      </HistoryProvider>
    </FavoritesProvider>
  );
};

const AppContent: React.FC<{
  children: React.ReactNode;
  theme: ThemeMode;
  toggleTheme: () => void;
}> = ({ children, theme, toggleTheme }) => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { history, addHistoryItem, clearHistory } = useHistory();

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        bookmarks: favorites,
        watchHistory: history,
        toggleBookmark: toggleFavorite,
        isBookmarked: isFavorite,
        addWatchHistory: addHistoryItem,
        clearWatchHistory: clearHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
