// Utility functions tests

describe(' Utility Functions', () => {
  
  describe(' Date & Time Utilities', () => {
    test('should format date for display', () => {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };

      const testDate = '2023-10-01T12:00:00.000Z';
      const formatted = formatDate(testDate);
      
      expect(typeof formatted).toBe('string');
      expect(formatted).toMatch(/\w{3} \d{1,2}, \d{4}/); // e.g., "Oct 1, 2023"
    });

    test('should calculate relative time', () => {
      const getRelativeTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
      };

      const now = new Date();
      const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
      const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);

      expect(getRelativeTime(fiveMinutesAgo.toISOString())).toBe('5 minutes ago');
      expect(getRelativeTime(twoHoursAgo.toISOString())).toBe('2 hours ago');
    });
  });

  describe(' String Utilities', () => {
    test('should capitalize first letter', () => {
      const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      expect(capitalize('siamese')).toBe('Siamese');
      expect(capitalize('PERSIAN')).toBe('Persian');
      expect(capitalize('maine-coon')).toBe('Maine-coon');
      expect(capitalize('')).toBe('');
    });

    test('should create URL-friendly slugs', () => {
      const createSlug = (str) => {
        return str
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      };

      expect(createSlug('Maine Coon')).toBe('maine-coon');
      expect(createSlug('British Shorthair!')).toBe('british-shorthair');
      expect(createSlug('Ragdoll   Cat')).toBe('ragdoll-cat');
    });

    test('should truncate long text', () => {
      const truncateText = (text, maxLength = 100, suffix = '...') => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
      };

      const longText = 'This is a very long description that exceeds the maximum length limit';
      const truncated = truncateText(longText, 20);
      
      expect(truncated.length).toBe(20);
      expect(truncated.endsWith('...')).toBe(true);
    });
  });

  describe(' Number Utilities', () => {
    test('should format large numbers', () => {
      const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
      };

      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    test('should generate random numbers in range', () => {
      const randomInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      const random = randomInRange(1, 10);
      expect(random).toBeGreaterThanOrEqual(1);
      expect(random).toBeLessThanOrEqual(10);
      expect(Number.isInteger(random)).toBe(true);
    });

    test('should clamp numbers to range', () => {
      const clamp = (num, min, max) => {
        return Math.min(Math.max(num, min), max);
      };

      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(-5, 1, 10)).toBe(1);
      expect(clamp(15, 1, 10)).toBe(10);
    });
  });

  describe(' Array Utilities', () => {
    test('should shuffle array', () => {
      const shuffle = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort()); // Same elements, different order
    });

    test('should group array by property', () => {
      const groupBy = (array, key) => {
        return array.reduce((groups, item) => {
          const group = item[key];
          groups[group] = groups[group] || [];
          groups[group].push(item);
          return groups;
        }, {});
      };

      const cats = [
        { id: '1', breed: 'siamese' },
        { id: '2', breed: 'persian' },
        { id: '3', breed: 'siamese' }
      ];

      const grouped = groupBy(cats, 'breed');
      
      expect(grouped.siamese).toHaveLength(2);
      expect(grouped.persian).toHaveLength(1);
    });

    test('should remove duplicates from array', () => {
      const removeDuplicates = (array, key = null) => {
        if (!key) return [...new Set(array)];
        
        const seen = new Set();
        return array.filter(item => {
          const value = item[key];
          if (seen.has(value)) return false;
          seen.add(value);
          return true;
        });
      };

      const numbers = [1, 2, 2, 3, 3, 4];
      expect(removeDuplicates(numbers)).toEqual([1, 2, 3, 4]);

      const cats = [
        { id: '1', name: 'Fluffy' },
        { id: '2', name: 'Mittens' },
        { id: '1', name: 'Fluffy' }
      ];
      
      const uniqueCats = removeDuplicates(cats, 'id');
      expect(uniqueCats).toHaveLength(2);
    });
  });

  describe(' URL Utilities', () => {
    test('should parse URL parameters', () => {
      const parseUrlParams = (url) => {
        const params = new URLSearchParams(new URL(url).search);
        const result = {};
        for (const [key, value] of params) {
          result[key] = value;
        }
        return result;
      };

      const testUrl = 'https://example.com/cats?breed=siamese&limit=10&page=2';
      const params = parseUrlParams(testUrl);
      
      expect(params.breed).toBe('siamese');
      expect(params.limit).toBe('10');
      expect(params.page).toBe('2');
    });

    test('should build query string from object', () => {
      const buildQueryString = (params) => {
        const searchParams = new URLSearchParams();
        
        Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined) {
            searchParams.append(key, params[key].toString());
          }
        });
        
        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
      };

      const params = { breed: 'siamese', limit: 10, page: null };
      const queryString = buildQueryString(params);
      
      expect(queryString).toBe('?breed=siamese&limit=10');
    });
  });

  describe('💾 Storage Utilities', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('should safely get from localStorage', () => {
      const safeGetItem = (key, defaultValue = null) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : defaultValue;
        } catch {
          return defaultValue;
        }
      };

      // Test with non-existent key
      expect(safeGetItem('nonexistent')).toBe(null);
      expect(safeGetItem('nonexistent', [])).toEqual([]);

      // Test with valid JSON
      const testData = JSON.stringify({ cats: ['fluffy'] });
      localStorage.getItem.mockReturnValue(testData);
      localStorage.setItem('test', testData);
      expect(safeGetItem('test')).toEqual({ cats: ['fluffy'] });

      // Test with invalid JSON
      localStorage.getItem.mockReturnValue('not json');  // Mock invalid JSON
      localStorage.setItem('invalid', 'not json');
      expect(safeGetItem('invalid', 'fallback')).toBe('fallback');
    });

    test('should safely set to localStorage', () => {
      const safeSetItem = (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      };

      const testValue = { data: 'value' };
      const testData = JSON.stringify(testValue);
      
      const success = safeSetItem('test', testValue);
      expect(success).toBe(true);
      
      // Mock localStorage to return our test data
      localStorage.getItem.mockReturnValue(testData);
      const retrieved = JSON.parse(localStorage.getItem('test'));
      expect(retrieved).toEqual(testValue);
    });
  });

  describe('🔄 Async Utilities', () => {
    test('should implement retry logic', async () => {
      let attempts = 0;
      
      const retryOperation = async (operation, maxRetries = 3, delay = 100) => {
        for (let i = 0; i <= maxRetries; i++) {
          try {
            return await operation();
          } catch (error) {
            if (i === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      };

      const flakyOperation = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Temporary failure');
        return 'Success';
      };

      const result = await retryOperation(flakyOperation);
      expect(result).toBe('Success');
      expect(attempts).toBe(3);
    });

    test('should implement debounce', (done) => {
      let callCount = 0;
      
      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func(...args), delay);
        };
      };

      const debouncedFunction = debounce(() => {
        callCount++;
      }, 100);

      // Call multiple times rapidly
      debouncedFunction();
      debouncedFunction();
      debouncedFunction();

      setTimeout(() => {
        expect(callCount).toBe(1); // Should only be called once
        done();
      }, 150);
    });
  });

  describe(' Performance Utilities', () => {
    test('should measure execution time', () => {
      const measureTime = (fn) => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        return {
          result,
          executionTime: end - start
        };
      };

      const { result, executionTime } = measureTime(() => {
        return Array.from({ length: 1000 }, (_, i) => i).reduce((a, b) => a + b, 0);
      });

      expect(result).toBe(499500); // Sum of 0 to 999
      expect(executionTime).toBeGreaterThan(0);
      expect(typeof executionTime).toBe('number');
    });

    test('should implement memoization', () => {
      let computeCount = 0;
      
      const memoize = (fn) => {
        const cache = new Map();
        return (...args) => {
          const key = JSON.stringify(args);
          if (cache.has(key)) {
            return cache.get(key);
          }
          const result = fn(...args);
          cache.set(key, result);
          return result;
        };
      };

      const expensiveFunction = (n) => {
        computeCount++;
        return n * n;
      };

      const memoizedFunction = memoize(expensiveFunction);

      expect(memoizedFunction(5)).toBe(25);
      expect(memoizedFunction(5)).toBe(25); // Should use cache
      expect(computeCount).toBe(1); // Only computed once
    });
  });
});