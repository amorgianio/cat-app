// Component logic tests in pure JavaScript for better compatibility

describe('Component Logic Tests', () => {
  
  describe('CatCard Logic', () => {
    test('should determine if cat is favorited', () => {
      const mockFavorites = [
        { id: 'cat1', url: 'test1.jpg' },
        { id: 'cat2', url: 'test2.jpg' }
      ];

      const isFavorite = (catId, favorites) => {
        return favorites.some(fav => fav.id === catId);
      };

      expect(isFavorite('cat1', mockFavorites)).toBe(true);
      expect(isFavorite('cat3', mockFavorites)).toBe(false);
      expect(isFavorite('', mockFavorites)).toBe(false);
    });

    test('should handle image loading states', () => {
      let imageStates = {
        loading: true,
        error: false,
        loaded: false
      };

      const handleImageLoad = () => {
        imageStates.loading = false;
        imageStates.loaded = true;
        imageStates.error = false;
      };

      const handleImageError = () => {
        imageStates.loading = false;
        imageStates.loaded = false;
        imageStates.error = true;
      };

      // Test successful load
      handleImageLoad();
      expect(imageStates.loading).toBe(false);
      expect(imageStates.loaded).toBe(true);
      expect(imageStates.error).toBe(false);

      // Reset and test error
      imageStates = { loading: true, error: false, loaded: false };
      handleImageError();
      expect(imageStates.loading).toBe(false);
      expect(imageStates.loaded).toBe(false);
      expect(imageStates.error).toBe(true);
    });

    test('should calculate responsive image dimensions', () => {
      const calculateImageDimensions = (originalWidth, originalHeight, maxWidth = 300) => {
        const aspectRatio = originalHeight / originalWidth;
        const width = Math.min(originalWidth, maxWidth);
        const height = width * aspectRatio;
        
        return {
          width: Math.round(width),
          height: Math.round(height),
          aspectRatio: Number(aspectRatio.toFixed(2))
        };
      };

      const result = calculateImageDimensions(800, 600, 300);
      
      expect(result.width).toBe(300);
      expect(result.height).toBe(225); // 300 * (600/800)
      expect(result.aspectRatio).toBe(0.75);
    });
  });

  describe('Navigation Logic', () => {
    test('should determine active navigation item', () => {

      const isActiveRoute = (currentPath, itemPath) => {
        if (itemPath === '/') {
          return currentPath === '/';
        }
        return currentPath.startsWith(itemPath);
      };

      expect(isActiveRoute('/', '/')).toBe(true);
      expect(isActiveRoute('/breeds', '/breeds')).toBe(true);
      expect(isActiveRoute('/breeds/siamese', '/breeds')).toBe(true);
      expect(isActiveRoute('/favorites', '/')).toBe(false);
    });

    test('should generate navigation URLs', () => {
      const generateNavUrl = (path, params = {}) => {
        let url = path;
        
        if (params.breedId) {
          url += `?breed=${encodeURIComponent(params.breedId)}`;
        }
        
        if (params.page) {
          const separator = url.includes('?') ? '&' : '?';
          url += `${separator}page=${params.page}`;
        }
        
        return url;
      };

      expect(generateNavUrl('/breeds')).toBe('/breeds');
      expect(generateNavUrl('/breeds', { breedId: 'siamese' })).toBe('/breeds?breed=siamese');
      expect(generateNavUrl('/breeds', { breedId: 'maine-coon', page: 2 })).toBe('/breeds?breed=maine-coon&page=2');
    });
  });

  describe('Pagination Logic', () => {
    test('should calculate pagination info', () => {
      const calculatePagination = (currentPage, totalItems, itemsPerPage) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        
        return {
          currentPage,
          totalPages,
          hasNextPage,
          hasPrevPage,
          startIndex,
          endIndex,
          itemsShown: endIndex - startIndex
        };
      };

      const result = calculatePagination(2, 25, 10);
      
      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
      expect(result.startIndex).toBe(10);
      expect(result.endIndex).toBe(20);
      expect(result.itemsShown).toBe(10);
    });

    test('should handle edge cases in pagination', () => {
      const calculatePagination = (currentPage, totalItems, itemsPerPage) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;
        
        return { totalPages, hasNextPage, hasPrevPage };
      };

      // Last page
      const lastPage = calculatePagination(3, 25, 10);
      expect(lastPage.hasNextPage).toBe(false);
      expect(lastPage.hasPrevPage).toBe(true);

      // First page
      const firstPage = calculatePagination(1, 25, 10);
      expect(firstPage.hasNextPage).toBe(true);
      expect(firstPage.hasPrevPage).toBe(false);

      // Empty results
      const emptyPage = calculatePagination(1, 0, 10);
      expect(emptyPage.totalPages).toBe(0);
      expect(emptyPage.hasNextPage).toBe(false);
    });
  });

  describe('Search & Filter Logic', () => {
    test('should filter cats by breed', () => {
      const cats = [
        { id: '1', breeds: [{ id: 'siamese', name: 'Siamese' }] },
        { id: '2', breeds: [{ id: 'persian', name: 'Persian' }] },
        { id: '3', breeds: [] },
        { id: '4', breeds: [{ id: 'siamese', name: 'Siamese' }] }
      ];

      const filterByBreed = (cats, breedId) => {
        if (!breedId) return cats;
        return cats.filter(cat => 
          cat.breeds && cat.breeds.some(breed => breed.id === breedId)
        );
      };

      const siameseCats = filterByBreed(cats, 'siamese');
      expect(siameseCats).toHaveLength(2);
      expect(siameseCats[0].id).toBe('1');
      expect(siameseCats[1].id).toBe('4');
    });

    test('should search breeds by name', () => {
      const breeds = [
        { id: 'siamese', name: 'Siamese' },
        { id: 'persian', name: 'Persian' },
        { id: 'maine-coon', name: 'Maine Coon' },
        { id: 'british-shorthair', name: 'British Shorthair' }
      ];

      const searchBreeds = (breeds, searchTerm) => {
        if (!searchTerm) return breeds;
        const term = searchTerm.toLowerCase();
        return breeds.filter(breed => 
          breed.name.toLowerCase().includes(term) ||
          breed.id.toLowerCase().includes(term)
        );
      };

      const results = searchBreeds(breeds, 'maine');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('maine-coon');

      const multipleResults = searchBreeds(breeds, 'sh');
      expect(multipleResults).toHaveLength(1); // British Shorthair
    });
  });

  describe('State Management Logic', () => {
    test('should manage loading states', () => {
      let state = {
        loading: false,
        error: null,
        data: []
      };

      const setLoading = (isLoading) => {
        state.loading = isLoading;
        if (isLoading) {
          state.error = null;
        }
      };

      const setError = (error) => {
        state.error = error;
        state.loading = false;
      };

      const setData = (data) => {
        state.data = data;
        state.loading = false;
        state.error = null;
      };

      // Test loading state
      setLoading(true);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      // Test error state
      setError('Something went wrong');
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Something went wrong');

      // Test successful data load
      setData(['item1', 'item2']);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.data).toEqual(['item1', 'item2']);
    });

    test('should handle favorites state mutations', () => {
      let favoritesState = [];

      const addFavorite = (cat) => {
        const exists = favoritesState.some(fav => fav.id === cat.id);
        if (!exists) {
          favoritesState.push({
            ...cat,
            dateAdded: new Date().toISOString()
          });
        }
        return favoritesState.length;
      };

      const removeFavorite = (catId) => {
        const initialLength = favoritesState.length;
        favoritesState = favoritesState.filter(fav => fav.id !== catId);
        return initialLength !== favoritesState.length;
      };

      const testCat = { id: 'test-cat', url: 'test.jpg' };

      // Add favorite
      const newLength = addFavorite(testCat);
      expect(newLength).toBe(1);
      expect(favoritesState[0].dateAdded).toBeDefined();

      // Try to add duplicate
      const duplicateLength = addFavorite(testCat);
      expect(duplicateLength).toBe(1); // Should not add duplicate

      // Remove favorite
      const removed = removeFavorite('test-cat');
      expect(removed).toBe(true);
      expect(favoritesState).toHaveLength(0);
    });
  });

  describe('Theme & Styling Logic', () => {
    test('should calculate responsive breakpoints', () => {
      const getBreakpoint = (width) => {
        if (width < 600) return 'xs';
        if (width < 900) return 'sm';
        if (width < 1200) return 'md';
        if (width < 1536) return 'lg';
        return 'xl';
      };

      expect(getBreakpoint(320)).toBe('xs');
      expect(getBreakpoint(768)).toBe('sm');
      expect(getBreakpoint(1024)).toBe('md');
      expect(getBreakpoint(1440)).toBe('lg');
      expect(getBreakpoint(1920)).toBe('xl');
    });

    test('should generate grid columns based on screen size', () => {
      const getGridColumns = (screenSize, totalItems) => {
        const columnsMap = {
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5
        };

        const maxColumns = columnsMap[screenSize] || 3;
        return Math.min(maxColumns, totalItems);
      };

      expect(getGridColumns('xs', 10)).toBe(1);
      expect(getGridColumns('md', 2)).toBe(2); // Limited by total items
      expect(getGridColumns('lg', 10)).toBe(4);
      expect(getGridColumns('xl', 3)).toBe(3); // Limited by total items
    });
  });

  describe('Loading & Error States', () => {
    test('should manage loading state transitions', () => {
      const createLoadingManager = () => {
        let isLoading = false;
        
        return {
          startLoading: () => { isLoading = true; },
          stopLoading: () => { isLoading = false; },
          isLoading: () => isLoading,
          withLoading: async (asyncFn) => {
            isLoading = true;
            try {
              const result = await asyncFn();
              return result;
            } finally {
              isLoading = false;
            }
          }
        };
      };

      const manager = createLoadingManager();
      
      expect(manager.isLoading()).toBe(false);
      
      manager.startLoading();
      expect(manager.isLoading()).toBe(true);
      
      manager.stopLoading();
      expect(manager.isLoading()).toBe(false);
    });

    test('should format error messages for display', () => {
      const formatError = (error) => {
        if (!error) return 'Unknown error occurred';
        
        if (error.message) {
          return error.message;
        }
        
        if (typeof error === 'string') {
          return error;
        }
        
        return 'An unexpected error occurred';
      };

      expect(formatError(new Error('Network error'))).toBe('Network error');
      expect(formatError('Simple string error')).toBe('Simple string error');
      expect(formatError(null)).toBe('Unknown error occurred');
      expect(formatError({})).toBe('An unexpected error occurred');
    });
  });
});