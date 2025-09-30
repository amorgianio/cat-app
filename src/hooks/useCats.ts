import { useState, useEffect, useCallback, useMemo } from 'react';
import { CatImage, Breed, FavoriteCat } from '../types';
import { catApi, favoritesStorage } from '../services/catApi';
import { PERFORMANCE_CONFIG, PerformanceMonitor } from '../config/performance';

// Hook for managing random cat images with performance optimizations
// Uses AbortController to prevent duplicate API calls in React Strict Mode
export const useRandomCats = () => {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const loadCats = async (
    limit: number = PERFORMANCE_CONFIG.LOAD_BATCH_SIZE, 
    append: boolean = false,
    signal?: AbortSignal
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Pass AbortSignal to API call
      const newCats = await catApi.getRandomCats(limit, signal);
      
      // Check if request was aborted before updating state
      if (signal?.aborted) {
        console.log('Request was aborted, skipping state update');
        return;
      }
      
      setCats((prev: CatImage[]) => {
        let updatedCats: CatImage[];
        
        if (append) {
          updatedCats = [...prev, ...newCats];
          
          // Memory management: Keep only recent cats if we exceed threshold
          if (updatedCats.length > PERFORMANCE_CONFIG.AUTO_CLEANUP_THRESHOLD) {
            console.log(`Memory cleanup: Removing ${updatedCats.length - PERFORMANCE_CONFIG.MAX_CATS_IN_MEMORY} older cats`);
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
      // Don't set error if request was aborted (expected behavior)
      if (signal?.aborted || (err as Error)?.name === 'AbortError') {
        console.log('Request aborted by cleanup');
        return;
      }
      setError('Failed to load cats. Please try again.');
      console.error('Error loading cats:', err);
    } finally {
      // Only set loading to false if request wasn't aborted
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Create AbortController to handle React Strict Mode double calls
    const abortController = new AbortController();
    
    loadCats(PERFORMANCE_CONFIG.LOAD_BATCH_SIZE, false, abortController.signal);
    
    // Cleanup function to abort request if component unmounts or effect re-runs
    return () => {
      abortController.abort();
    };
  }, []);

  // Memoize expensive functions to prevent recreation
  const loadMore = useCallback(() => {
    if (!hasReachedLimit) {
      loadCats(PERFORMANCE_CONFIG.LOAD_BATCH_SIZE, true);
    }
  }, [hasReachedLimit]);

  const resetAndReload = useCallback(() => {
    setCats([]);
    setTotalLoaded(0);
    setHasReachedLimit(false);
    loadCats();
  }, []);

  // Memoize computed values
  const canLoadMore = useMemo(() => 
    !loading && !hasReachedLimit && totalLoaded < PERFORMANCE_CONFIG.SOFT_LIMIT_TOTAL,
    [loading, hasReachedLimit, totalLoaded]
  );

  return { 
    cats, 
    loading, 
    error, 
    loadMore, 
    reload: resetAndReload,
    totalLoaded,
    hasReachedLimit,
    canLoadMore
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

  // Memoize loadFavorites to prevent recreation
  const loadFavorites = useCallback(() => {
    const favs = favoritesStorage.getFavorites();
    setFavorites(favs);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Memoize favorite operations
  const addToFavorites = useCallback((cat: CatImage) => {
    favoritesStorage.addToFavorites(cat);
    loadFavorites();
  }, [loadFavorites]);

  const removeFromFavorites = useCallback((catId: string) => {
    favoritesStorage.removeFromFavorites(catId);
    loadFavorites();
  }, [loadFavorites]);

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