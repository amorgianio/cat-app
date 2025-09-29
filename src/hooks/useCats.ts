import { useState, useEffect } from 'react';
import { CatImage, Breed, FavoriteCat } from '../types';
import { catApi, favoritesStorage } from '../services/catApi';
import { PERFORMANCE_CONFIG, PerformanceMonitor } from '../config/performance';

// Hook for managing random cat images with performance optimizations
export const useRandomCats = () => {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const loadCats = async (limit: number = PERFORMANCE_CONFIG.LOAD_BATCH_SIZE, append: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCats = await catApi.getRandomCats(limit);
      
      setCats((prev: CatImage[]) => {
        let updatedCats: CatImage[];
        
        if (append) {
          updatedCats = [...prev, ...newCats];
          
          // Memory management: Keep only recent cats if we exceed threshold
          if (updatedCats.length > PERFORMANCE_CONFIG.AUTO_CLEANUP_THRESHOLD) {
            console.log(`🧹 Memory cleanup: Removing ${updatedCats.length - PERFORMANCE_CONFIG.MAX_CATS_IN_MEMORY} older cats`);
            updatedCats = updatedCats.slice(-PERFORMANCE_CONFIG.MAX_CATS_IN_MEMORY);
            
            // Log performance metrics
            if (PERFORMANCE_CONFIG.SHOW_PERFORMANCE_INFO) {
              PerformanceMonitor.logPerformanceMetrics(updatedCats.length);
            }
          }
        } else {
          updatedCats = newCats;
        }
        
        return updatedCats;
      });
      
      setTotalLoaded((prev: number) => prev + newCats.length);
      
      // Check if we should limit loading
      if (totalLoaded >= PERFORMANCE_CONFIG.SOFT_LIMIT_TOTAL) {
        setHasReachedLimit(true);
      }
      
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

  const loadMore = () => {
    if (!hasReachedLimit) {
      loadCats(PERFORMANCE_CONFIG.LOAD_BATCH_SIZE, true);
    }
  };

  const resetAndReload = () => {
    setCats([]);
    setTotalLoaded(0);
    setHasReachedLimit(false);
    loadCats();
  };

  return { 
    cats, 
    loading, 
    error, 
    loadMore, 
    reload: resetAndReload,
    totalLoaded,
    hasReachedLimit,
    canLoadMore: !hasReachedLimit && !loading
  };
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