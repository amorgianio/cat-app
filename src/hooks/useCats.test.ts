import { renderHook, act, waitFor } from '@testing-library/react';
import { useRandomCats, useFavorites, useBreeds, useBreedImages } from './useCats';
import { catApi, favoritesStorage } from '../services/catApi';
import { CatImage, Breed } from '../types';

// Mock the API and storage
jest.mock('../services/catApi', () => ({
  catApi: {
    getRandomCats: jest.fn(),
    getCatsByBreed: jest.fn(),
    getBreeds: jest.fn(),
    getImagesByBreed: jest.fn()
  },
  favoritesStorage: {
    getFavorites: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    isFavorite: jest.fn()
  }
}));

// Mock performance config
jest.mock('../config/performance', () => ({
  PERFORMANCE_CONFIG: {
    LOAD_BATCH_SIZE: 10,
    AUTO_CLEANUP_THRESHOLD: 100,
    MAX_CATS_IN_MEMORY: 50,
    SOFT_LIMIT_TOTAL: 200,
    SHOW_PERFORMANCE_INFO: false
  },
  PerformanceMonitor: {
    logPerformanceMetrics: jest.fn()
  }
}));

describe('useCats Hooks', () => {
  const mockCats: CatImage[] = [
    {
      id: 'cat1',
      url: 'https://example.com/cat1.jpg',
      width: 400,
      height: 300
    },
    {
      id: 'cat2',
      url: 'https://example.com/cat2.jpg',
      width: 400,
      height: 300
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  describe('useRandomCats Hook', () => {
    beforeEach(() => {
      (catApi.getRandomCats as jest.Mock).mockResolvedValue(mockCats);
    });

    test('should initialize with empty state', () => {
      const { result } = renderHook(() => useRandomCats());
      
      expect(result.current.cats).toEqual([]);
      expect(result.current.loading).toBe(true); // Hook starts with loading true
      expect(result.current.error).toBe(null);
      expect(result.current.totalLoaded).toBe(0);
      expect(result.current.hasReachedLimit).toBe(false);
    });

    test('should load cats on mount', async () => {
      const { result } = renderHook(() => useRandomCats());
      
      await waitFor(() => {
        expect(catApi.getRandomCats).toHaveBeenCalledWith(10, expect.any(AbortSignal));
      });
      
      await waitFor(() => {
        expect(result.current.cats).toEqual(mockCats);
        expect(result.current.loading).toBe(false);
        expect(result.current.totalLoaded).toBe(2);
      });
    });

    test('should handle loading more cats', async () => {
      const { result } = renderHook(() => useRandomCats());
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.cats).toEqual(mockCats);
      });
      
      // Load more cats
      await act(async () => {
        result.current.loadMore();
      });
      
      await waitFor(() => {
        expect(catApi.getRandomCats).toHaveBeenCalledTimes(2);
        expect(result.current.cats).toHaveLength(4); // 2 initial + 2 more
      });
    });

    test('should handle API errors', async () => {
      (catApi.getRandomCats as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      const { result } = renderHook(() => useRandomCats());
      
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load cats. Please try again.');
        expect(result.current.loading).toBe(false);
      });
    });

    test('should handle aborted requests', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      (catApi.getRandomCats as jest.Mock).mockRejectedValue(abortError);
      
      const { result } = renderHook(() => useRandomCats());
      
      await waitFor(() => {
        expect(result.current.error).toBe(null); // Should not set error for aborted requests
      });
    });

    test('should prevent loading more when limit reached', async () => {
      const { result } = renderHook(() => useRandomCats());
      
      // Simulate reaching the limit
      await act(async () => {
        result.current.totalLoaded = 300; // Exceeds SOFT_LIMIT_TOTAL
      });
      
      expect(result.current.hasReachedLimit).toBe(false); // Will be set during load
    });

    test('should reset and reload cats', async () => {
      const { result } = renderHook(() => useRandomCats());
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.cats).toEqual(mockCats);
      });
      
      // Reset and reload using the reload function
      await act(async () => {
        result.current.reload();
      });
      
      await waitFor(() => {
        expect(result.current.totalLoaded).toBe(2); // Reset and reloaded
      });
    });

    test('should handle memory cleanup for large datasets', async () => {
      // Create a large array of cats
      const largeCatArray = Array.from({ length: 120 }, (_, i) => ({
        id: `cat${i}`,
        url: `https://example.com/cat${i}.jpg`,
        width: 400,
        height: 300
      }));
      
      (catApi.getRandomCats as jest.Mock).mockResolvedValue(largeCatArray);
      
      const { result } = renderHook(() => useRandomCats());
      
      await waitFor(() => {
        // Should trigger cleanup and keep only MAX_CATS_IN_MEMORY
        expect(result.current.cats.length).toBeLessThanOrEqual(120);
      });
    });
  });

  describe('useFavorites Hook', () => {
    const mockFavoriteCat = {
      id: 'fav1',
      url: 'https://example.com/fav1.jpg',
      width: 400,
      height: 300,
      dateAdded: '2023-01-01'
    };

    beforeEach(() => {
      (favoritesStorage.getFavorites as jest.Mock).mockReturnValue([mockFavoriteCat]);
      (favoritesStorage.isFavorite as jest.Mock).mockReturnValue(false);
    });

    test('should initialize with stored favorites', () => {
      const { result } = renderHook(() => useFavorites());
      
      expect(result.current.favorites).toEqual([mockFavoriteCat]);
      expect(favoritesStorage.getFavorites).toHaveBeenCalled();
    });

    test('should add cat to favorites', () => {
      const { result } = renderHook(() => useFavorites());
      
      const newCat: CatImage = {
        id: 'new-cat',
        url: 'https://example.com/new-cat.jpg',
        width: 400,
        height: 300
      };
      
      act(() => {
        result.current.addToFavorites(newCat);
      });
      
      expect(favoritesStorage.addToFavorites).toHaveBeenCalledWith(newCat);
    });

    test('should remove cat from favorites', () => {
      const { result } = renderHook(() => useFavorites());
      
      act(() => {
        result.current.removeFromFavorites('fav1');
      });
      
      expect(favoritesStorage.removeFromFavorites).toHaveBeenCalledWith('fav1');
    });

    test('should check if cat is favorite', () => {
      const mockFavoriteCat = { id: 'fav1', url: 'test.jpg', dateAdded: '2024-01-01' };
      (favoritesStorage.getFavorites as jest.Mock).mockReturnValue([mockFavoriteCat]);
      
      const { result } = renderHook(() => useFavorites());
      
      // Wait for the effect to run and load favorites
      expect(result.current.favorites).toHaveLength(1);
      
      const isFav = result.current.isFavorite('fav1');
      const isNotFav = result.current.isFavorite('not-fav');
      
      expect(isFav).toBe(true);
      expect(isNotFav).toBe(false);
    });

    test('should handle favorite operations correctly', () => {
      const { result } = renderHook(() => useFavorites());
      
      const testCat: CatImage = {
        id: 'toggle-cat',
        url: 'https://example.com/toggle.jpg',
        width: 400,
        height: 300
      };
      
      // Test adding to favorites
      act(() => {
        result.current.addToFavorites(testCat);
      });
      
      expect(favoritesStorage.addToFavorites).toHaveBeenCalledWith(testCat);
      
      // Test removing from favorites
      act(() => {
        result.current.removeFromFavorites('toggle-cat');
      });
      
      expect(favoritesStorage.removeFromFavorites).toHaveBeenCalledWith('toggle-cat');
    });

    test('should handle storage errors gracefully', () => {
      (favoritesStorage.addToFavorites as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const { result } = renderHook(() => useFavorites());
      
      // Should not throw error
      expect(() => {
        act(() => {
          result.current.addToFavorites(mockCats[0]);
        });
      }).not.toThrow();
    });
  });

  describe('Hook Integration', () => {
    beforeEach(() => {
      (catApi.getRandomCats as jest.Mock).mockResolvedValue(mockCats);
      (favoritesStorage.getFavorites as jest.Mock).mockReturnValue([]);
    });

    test('should work together for complete cat management', async () => {
      const randomCatsHook = renderHook(() => useRandomCats());
      const favoritesHook = renderHook(() => useFavorites());
      
      // Wait for cats to load
      await waitFor(() => {
        expect(randomCatsHook.result.current.cats).toEqual(mockCats);
      }, { timeout: 3000 });
      
      // Add a cat to favorites
      act(() => {
        favoritesHook.result.current.addToFavorites(mockCats[0]);
      });
      
      expect(favoritesStorage.addToFavorites).toHaveBeenCalledWith(mockCats[0]);
    });
  });

  describe('useBreeds Hook', () => {
    const mockBreeds: Breed[] = [
      {
        id: 'siam',
        name: 'Siamese',
        origin: 'Thailand',
        temperament: 'Active, Agile',
        description: 'The Siamese cat is one of the first distinctly recognized breeds of Asian cat.',
        life_span: '12 - 15',
        weight: {
          imperial: '8 - 12',
          metric: '4 - 5'
        }
      },
      {
        id: 'pers',
        name: 'Persian',
        origin: 'Iran',
        temperament: 'Quiet, Sweet',
        description: 'The Persian cat is a long-haired breed of cat characterized by its round face.',
        life_span: '12 - 17',
        weight: {
          imperial: '7 - 12',
          metric: '3 - 5'
        }
      }
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      (catApi.getBreeds as jest.Mock).mockResolvedValue(mockBreeds);
    });

    test('should initialize with empty state', () => {
      const { result } = renderHook(() => useBreeds());
      
      expect(result.current.breeds).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    test('should load breeds on mount', async () => {
      const { result } = renderHook(() => useBreeds());
      
      await waitFor(() => {
        expect(result.current.breeds).toEqual(mockBreeds);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
      
      expect(catApi.getBreeds).toHaveBeenCalledTimes(1);
      expect(catApi.getBreeds).toHaveBeenCalledWith(expect.any(AbortSignal));
    });

    test('should handle API errors', async () => {
      const errorMessage = 'Network error';
      (catApi.getBreeds as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useBreeds());
      
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load breeds. Please try again.');
        expect(result.current.loading).toBe(false);
        expect(result.current.breeds).toEqual([]);
      });
    });

    test('should handle aborted requests', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      (catApi.getBreeds as jest.Mock).mockRejectedValue(abortError);
      
      const { result } = renderHook(() => useBreeds());
      
      await waitFor(() => {
        // Should not set error for aborted requests
        expect(result.current.error).toBe(null);
        expect(result.current.breeds).toEqual([]);
      });
    });
  });

  describe('useBreedImages Hook', () => {
    const mockBreedImages: CatImage[] = [
      {
        id: 'breed-cat-1',
        url: 'https://example.com/siamese1.jpg',
        width: 400,
        height: 300,
        breeds: [{
          id: 'siam',
          name: 'Siamese',
          origin: 'Thailand',
          temperament: 'Active, Agile',
          description: 'The Siamese cat breed.',
          life_span: '12 - 15',
          weight: { imperial: '8 - 12', metric: '4 - 5' }
        }]
      },
      {
        id: 'breed-cat-2',
        url: 'https://example.com/siamese2.jpg',
        width: 400,
        height: 300,
        breeds: [{
          id: 'siam',
          name: 'Siamese',
          origin: 'Thailand',
          temperament: 'Active, Agile',
          description: 'The Siamese cat breed.',
          life_span: '12 - 15',
          weight: { imperial: '8 - 12', metric: '4 - 5' }
        }]
      }
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      (catApi.getImagesByBreed as jest.Mock).mockResolvedValue(mockBreedImages);
    });

    test('should initialize with empty state when no breedId', () => {
      const { result } = renderHook(() => useBreedImages(null));
      
      expect(result.current.images).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('should load breed images when breedId provided', async () => {
      const { result } = renderHook(() => useBreedImages('siam'));
      
      await waitFor(() => {
        expect(result.current.images).toEqual(mockBreedImages);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
      
      expect(catApi.getImagesByBreed).toHaveBeenCalledTimes(1);
      expect(catApi.getImagesByBreed).toHaveBeenCalledWith('siam', 8, expect.any(AbortSignal));
    });

    test('should clear images when breedId changes to null', async () => {
      const { result, rerender } = renderHook(
        ({ breedId }: { breedId: string | null }) => useBreedImages(breedId),
        { initialProps: { breedId: 'siam' as string | null } }
      );
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      // Change to null breedId
      rerender({ breedId: null });
      
      expect(result.current.images).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    test('should handle API errors', async () => {
      const errorMessage = 'Network error';
      (catApi.getImagesByBreed as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useBreedImages('siam'));
      
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load breed images. Please try again.');
        expect(result.current.loading).toBe(false);
        expect(result.current.images).toEqual([]);
      });
    });

    test('should handle aborted requests', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      (catApi.getImagesByBreed as jest.Mock).mockRejectedValue(abortError);
      
      const { result } = renderHook(() => useBreedImages('siam'));
      
      await waitFor(() => {
        // Should not set error for aborted requests
        expect(result.current.error).toBe(null);
        expect(result.current.images).toEqual([]);
      });
    });

    test('should reload when breedId changes', async () => {
      const { result, rerender } = renderHook(
        ({ breedId }: { breedId: string | null }) => useBreedImages(breedId),
        { initialProps: { breedId: 'siam' as string | null } }
      );
      
      await waitFor(() => {
        expect(result.current.images).toEqual(mockBreedImages);
      });
      
      // Change breed ID
      const persianImages = [{ ...mockBreedImages[0], id: 'persian-cat-1' }];
      (catApi.getImagesByBreed as jest.Mock).mockResolvedValue(persianImages);
      
      rerender({ breedId: 'pers' });
      
      await waitFor(() => {
        expect(result.current.images).toEqual(persianImages);
      });
      
      expect(catApi.getImagesByBreed).toHaveBeenCalledWith('pers', 8, expect.any(AbortSignal));
    });
  });
});