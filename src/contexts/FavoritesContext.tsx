import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FavoriteCat, CatImage } from '../types';

interface FavoritesContextType {
  favorites: FavoriteCat[];
  addToFavorites: (cat: CatImage) => void;
  removeFromFavorites: (catId: string) => void;
  isFavorite: (catId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteCat[]>([]);

  // Local storage functions to avoid axios import issues in tests
  const getFavorites = useCallback((): FavoriteCat[] => {
    const stored = localStorage.getItem('cat-favorites');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const loadFavorites = useCallback(() => {
    const favs = getFavorites();
    setFavorites(favs);
  }, [getFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addToFavorites = useCallback((cat: CatImage) => {
    try {
      const currentFavorites = getFavorites();
      const exists = currentFavorites.find(fav => fav.id === cat.id);
      
      if (!exists) {
        const favoriteCat: FavoriteCat = { ...cat, dateAdded: new Date().toISOString() };
        currentFavorites.push(favoriteCat);
        localStorage.setItem('cat-favorites', JSON.stringify(currentFavorites));
      }
      loadFavorites();
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  }, [getFavorites, loadFavorites]);

  const removeFromFavorites = useCallback((catId: string) => {
    try {
      const currentFavorites = getFavorites();
      const filtered = currentFavorites.filter(fav => fav.id !== catId);
      localStorage.setItem('cat-favorites', JSON.stringify(filtered));
      loadFavorites();
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  }, [getFavorites, loadFavorites]);

  const isFavorite = useCallback((catId: string) => {
    return favorites.some(fav => fav.id === catId);
  }, [favorites]);

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};