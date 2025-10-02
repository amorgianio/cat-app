import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { CatImage, Breed, FavoriteCat } from '../types';

// Security: Use environment variables for sensitive data
const API_KEY = process.env.REACT_APP_CAT_API_KEY;
const BASE_URL = process.env.REACT_APP_CAT_API_BASE_URL || 'https://api.thecatapi.com/v1';
const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'development';
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';
const PERFORMANCE_LOGGING = process.env.REACT_APP_PERFORMANCE_LOGGING === 'true';

// Validate required environment variables
if (!API_KEY) {
  console.error('Missing REACT_APP_CAT_API_KEY environment variable');
}

// Environment info logging (development only)
if (DEBUG_MODE) {
  console.log(`🐱 Cat API Environment: ${ENVIRONMENT}`);
  console.log(`🔧 Debug Mode: ${DEBUG_MODE}`);
  console.log(`📊 Performance Logging: ${PERFORMANCE_LOGGING}`);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  maxRedirects: 3, // Limit redirects for security
});

// Security: Add request/response interceptors
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log requests based on environment settings
    if (DEBUG_MODE) {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response received');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Input validation utilities
const validateInput = {
  limit: (limit: number): number => {
    const sanitized = Math.max(1, Math.min(50, Math.floor(limit))); // Clamp between 1-50
    if (sanitized !== limit) {
      console.warn(`Limit ${limit} sanitized to ${sanitized}`);
    }
    return sanitized;
  },
  
  imageId: (imageId: string): string => {
    // Validate imageId format (alphanumeric + some special chars)
    const sanitized = imageId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitized !== imageId) {
      console.warn('ImageId sanitized, invalid characters removed');
    }
    if (sanitized.length === 0) {
      throw new Error('Invalid image ID');
    }
    return sanitized;
  },
  
  breedId: (breedId: string): string => {
    // Validate breedId format
    const sanitized = breedId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitized !== breedId) {
      console.warn('BreedId sanitized, invalid characters removed');
    }
    if (sanitized.length === 0) {
      throw new Error('Invalid breed ID');
    }
    return sanitized;
  }
};

export const catApi = {
  // Get random cat images with input validation and AbortSignal support
  getRandomCats: async (limit: number = 10, signal?: AbortSignal): Promise<CatImage[]> => {
    const safeLimit = validateInput.limit(limit);
    const response = await api.get(`/images/search?limit=${safeLimit}&has_breeds=1`, {
      signal
    });
    return response.data;
  },

  // Get specific cat image by ID with input validation
  getCatById: async (imageId: string): Promise<CatImage> => {
    const safeImageId = validateInput.imageId(imageId);
    const response = await api.get(`/images/${safeImageId}`);
    return response.data;
  },

  // Get all cat breeds with AbortSignal support
  getBreeds: async (signal?: AbortSignal): Promise<Breed[]> => {
    const response = await api.get('/breeds', {
      signal
    });
    return response.data;
  },

  // Get images for a specific breed with input validation and AbortSignal support
  getImagesByBreed: async (breedId: string, limit: number = 8, signal?: AbortSignal): Promise<CatImage[]> => {
    const safeBreedId = validateInput.breedId(breedId);
    const safeLimit = validateInput.limit(limit);
    const response = await api.get(`/images/search?breed_ids=${safeBreedId}&limit=${safeLimit}`, {
      signal
    });
    return response.data;
  },
};

// Local storage utilities for favorites
export const favoritesStorage = {
  getFavorites: (): FavoriteCat[] => {
    const stored = localStorage.getItem('cat-favorites');
    return stored ? JSON.parse(stored) : [];
  },

  addToFavorites: (cat: CatImage): void => {
    const favorites = favoritesStorage.getFavorites();
    const exists = favorites.find(fav => fav.id === cat.id);
    
    if (!exists) {
      const favoriteCat: FavoriteCat = { ...cat, dateAdded: new Date().toISOString() };
      favorites.push(favoriteCat);
      localStorage.setItem('cat-favorites', JSON.stringify(favorites));
    }
  },

  removeFromFavorites: (catId: string): void => {
    const favorites = favoritesStorage.getFavorites();
    const filtered = favorites.filter(fav => fav.id !== catId);
    localStorage.setItem('cat-favorites', JSON.stringify(filtered));
  },

  isFavorite: (catId: string): boolean => {
    const favorites = favoritesStorage.getFavorites();
    return favorites.some(fav => fav.id === catId);
  },
};