import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BookmarkItem } from '../types/movie';
import { STORAGE_KEYS } from '../lib/constants';

interface FavoritesContextType {
  favorites: BookmarkItem[];
  addFavorite: (item: Omit<BookmarkItem, 'addedAt'>) => void;
  removeFavorite: (slug: string) => BookmarkItem | null;
  restoreFavorite: (item: BookmarkItem) => void;
  toggleFavorite: (item: Omit<BookmarkItem, 'addedAt'>) => void;
  isFavorite: (slug: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<BookmarkItem[]>(
    STORAGE_KEYS.BOOKMARKS,
    []
  );

  const isFavorite = useCallback(
    (slug: string) => {
      return favorites.some((item) => item.slug === slug);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (item: Omit<BookmarkItem, 'addedAt'>) => {
      setFavorites((prev) => {
        if (prev.some((b) => b.slug === item.slug)) return prev;
        return [{ ...item, addedAt: Date.now() }, ...prev];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (slug: string): BookmarkItem | null => {
      let removed: BookmarkItem | null = null;
      setFavorites((prev) => {
        const found = prev.find((b) => b.slug === slug);
        if (found) removed = found;
        return prev.filter((b) => b.slug !== slug);
      });
      return removed;
    },
    [setFavorites]
  );

  const restoreFavorite = useCallback(
    (item: BookmarkItem) => {
      setFavorites((prev) => {
        if (prev.some((b) => b.slug === item.slug)) return prev;
        return [item, ...prev];
      });
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (item: Omit<BookmarkItem, 'addedAt'>) => {
      setFavorites((prev) => {
        const exists = prev.some((b) => b.slug === item.slug);
        if (exists) {
          return prev.filter((b) => b.slug !== item.slug);
        } else {
          return [{ ...item, addedAt: Date.now() }, ...prev];
        }
      });
    },
    [setFavorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        restoreFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
