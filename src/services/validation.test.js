// Mock localStorage for testing
const localStorageMock = {
  data: {},
  getItem: function(key) { return this.data[key] || null; },
  setItem: function(key, value) { this.data[key] = value; },
  removeItem: function(key) { delete this.data[key]; },
  clear: function() { this.data = {}; }
};

// Only set if localStorage doesn't exist
if (typeof localStorage === 'undefined') {
  global.localStorage = localStorageMock;
}

describe('Input Validation Security Tests', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Replicate the validation functions from catApi.ts
  const validateInput = {
    limit: (limit) => {
      const sanitized = Math.max(1, Math.min(50, Math.floor(limit)));
      if (sanitized !== limit) {
        console.warn(`Limit ${limit} sanitized to ${sanitized}`);
      }
      return sanitized;
    },
    
    imageId: (imageId) => {
      if (!imageId || typeof imageId !== 'string') {
        throw new Error('Invalid image ID');
      }
      const sanitized = imageId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (sanitized !== imageId) {
        console.log('ImageId sanitized, invalid characters removed');
      }
      if (sanitized.length === 0) {
        throw new Error('Invalid image ID');
      }
      return sanitized;
    },
    
    breedId: (breedId) => {
      if (!breedId || typeof breedId !== 'string') {
        throw new Error('Invalid breed ID');
      }
      const sanitized = breedId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (sanitized !== breedId) {
        console.log('BreedId sanitized, invalid characters removed');
      }
      if (sanitized.length === 0) {
        throw new Error('Invalid breed ID');
      }
      return sanitized;
    }
  };

  describe('XSS Attack Prevention', () => {
    test('should block script injection attacks', () => {
      const scriptAttack = '<script>alert("XSS")</script>';
      const result = validateInput.imageId(scriptAttack);
      
      expect(result).toBe('scriptalertXSSscript');
      expect(consoleSpy).toHaveBeenCalledWith('ImageId sanitized, invalid characters removed');
    });

    test('should block HTML injection attacks', () => {
      const htmlAttack = '<img src=x onerror=alert("XSS")>';
      const result = validateInput.imageId(htmlAttack);
      
      expect(result).toBe('imgsrcxonerroralertXSS');
      expect(consoleSpy).toHaveBeenCalledWith('ImageId sanitized, invalid characters removed');
    });

    test('should block SQL injection attacks', () => {
      const sqlAttack = "'; DROP TABLE users; --";
      const result = validateInput.imageId(sqlAttack);
      
      expect(result).toBe('DROPTABLEusers--');
      expect(consoleSpy).toHaveBeenCalledWith('ImageId sanitized, invalid characters removed');
    });
  });

  describe('Valid Input Handling', () => {
    test('should allow legitimate cat image IDs', () => {
      const validIds = ['abc123', 'cat_image_001', 'breed-photo-2023'];
      
      validIds.forEach(id => {
        const result = validateInput.imageId(id);
        expect(result).toBe(id);
      });
    });

    test('should allow legitimate breed IDs', () => {
      const validBreeds = ['siamese', 'persian_cat', 'maine-coon'];
      
      validBreeds.forEach(breed => {
        const result = validateInput.breedId(breed);
        expect(result).toBe(breed);
      });
    });

    test('should handle valid API limits correctly', () => {
      expect(validateInput.limit(10)).toBe(10);
      expect(validateInput.limit(1)).toBe(1);
      expect(validateInput.limit(50)).toBe(50);
    });
  });

  describe('Edge Cases & Security', () => {
    test('should handle multiple attack vectors in one input', () => {
      const multiAttack = '<script>alert(1)</script><img src=x onerror=alert(2)>';
      const result = validateInput.imageId(multiAttack);
      
      // The regex removes all special characters, leaving only alphanumeric, underscore, and hyphen
      expect(result).toBe('scriptalert1scriptimgsrcxonerroralert2');
      expect(consoleSpy).toHaveBeenCalledWith('ImageId sanitized, invalid characters removed');
    });

    test('should prevent API abuse with limit clamping', () => {
      expect(validateInput.limit(0)).toBe(1);    // Too low
      expect(validateInput.limit(-5)).toBe(1);   // Negative
      expect(validateInput.limit(100)).toBe(50); // Too high
      expect(validateInput.limit(1.7)).toBe(1);  // Decimal
    });

    test('should throw errors for completely invalid input', () => {
      const invalidInputs = ['', null, undefined, '   ', '!@#$%^&*()'];
      
      invalidInputs.forEach(invalid => {
        if (invalid === '!@#$%^&*()') {
          // This one gets sanitized to empty string, then throws
          expect(() => validateInput.imageId(invalid)).toThrow('Invalid image ID');
        } else {
          expect(() => validateInput.imageId(invalid)).toThrow('Invalid image ID');
        }
      });
    });

    test('should handle performance with large inputs', () => {
      const longInput = 'a'.repeat(1000) + '<script>alert("test")</script>' + 'b'.repeat(1000);
      
      const startTime = Date.now();
      const result = validateInput.imageId(longInput);
      const endTime = Date.now();
      
      expect(result).toBe('a'.repeat(1000) + 'scriptalerttestscript' + 'b'.repeat(1000));
      expect(endTime - startTime).toBeLessThan(50); // Should be very fast
    });
  });

  describe('localStorage Security Tests', () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.getItem.mockReturnValue(null);
    });

    test('should handle empty storage correctly', () => {
      expect(localStorage.getItem('favorites')).toBeNull();
    });

    test('should store and retrieve favorites safely', () => {
      const favorites = ['cat1', 'cat2'];
      const favoritesJson = JSON.stringify(favorites);
      
      // Mock the localStorage behavior
      localStorage.getItem.mockReturnValue(favoritesJson);
      
      localStorage.setItem('favorites', favoritesJson);
      const retrieved = JSON.parse(localStorage.getItem('favorites'));
      expect(retrieved).toEqual(favorites);
    });

    test('should prevent XSS through localStorage', () => {
      const maliciousData = '<script>alert("XSS")</script>';
      
      // Mock localStorage to return the malicious data
      localStorage.getItem.mockReturnValue(maliciousData);
      
      localStorage.setItem('userInput', maliciousData);
      const retrieved = localStorage.getItem('userInput');
      // localStorage stores as string - validation should happen on retrieval
      expect(typeof retrieved).toBe('string');
      
      // When processing this data, it should be sanitized
      const sanitized = validateInput.imageId(retrieved);
      expect(sanitized).toBe('scriptalertXSSscript');
    });
  });

  describe('Performance Tests', () => {
    test('should handle large numbers efficiently', () => {
      const veryLargeNumber = 999999999;
      const result = validateInput.limit(veryLargeNumber);
      expect(result).toBe(50);
    });

    test('should process large strings quickly', () => {
      const hugeString = 'a'.repeat(10000) + '<script>malicious</script>' + 'b'.repeat(10000);
      
      const startTime = performance.now();
      const result = validateInput.imageId(hugeString);
      const endTime = performance.now();
      
      expect(result).toBe('a'.repeat(10000) + 'scriptmaliciousscript' + 'b'.repeat(10000));
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });
  });
});