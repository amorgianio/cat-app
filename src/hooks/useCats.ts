import { useState, useEffect } from 'react';
import { CatImage, Breed, FavoriteCat } from '../types';
import { catApi, favoritesStorage } from '../services/catApi';

// Hook for managing random cat images
export const useRandomCats = () => {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCats = async (limit: number = 10, append: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCats = await catApi.getRandomCats(limit);
      setCats(prev => append ? [...prev, ...newCats] : newCats);
    } catch (err) {
      setError('Failed to load cats. Please try again.');
      console.error('Error loading cats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCats();
  }, []);

  const loadMore = () => loadCats(10, true);

  return { cats, loading, error, loadMore, reload: () => loadCats() };
};

// Hook for managing cat breeds
export const useBreeds = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBreeds = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const breedsData = await catApi.getBreeds();
        setBreeds(breedsData);
      } catch (err) {
        setError('Failed to load breeds. Please try again.');
        console.error('Error loading breeds:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBreeds();
  }, []);

  return { breeds, loading, error };
};

// Hook for managing breed images
export const useBreedImages = (breedId: string | null) => {
  const [images, setImages] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!breedId) {
      setImages([]);
      return;
    }

    const loadBreedImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const imageData = await catApi.getImagesByBreed(breedId);
        setImages(imageData);
      } catch (err) {
        setError('Failed to load breed images. Please try again.');
        console.error('Error loading breed images:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBreedImages();
  }, [breedId]);

  return { images, loading, error };
};

// Hook for managing favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCat[]>([]);

  const loadFavorites = () => {
    const favs = favoritesStorage.getFavorites();
    setFavorites(favs);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addToFavorites = (cat: CatImage) => {
    favoritesStorage.addToFavorites(cat);
    loadFavorites();
  };

  const removeFromFavorites = (catId: string) => {
    favoritesStorage.removeFromFavorites(catId);
    loadFavorites();
  };

  const isFavorite = (catId: string) => {
    return favoritesStorage.isFavorite(catId);
  };

  return { favorites, addToFavorites, removeFromFavorites, isFavorite };
};

// Hook for getting a single cat image by ID
export const useCatById = (catId: string | null) => {
  const [cat, setCat] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!catId) {
      setCat(null);
      return;
    }

    const loadCat = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const catData = await catApi.getCatById(catId);
        setCat(catData);
      } catch (err) {
        setError('Failed to load cat details. Please try again.');
        console.error('Error loading cat:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCat();
  }, [catId]);

  return { cat, loading, error };
};