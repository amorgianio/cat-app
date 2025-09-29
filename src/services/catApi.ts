import axios from 'axios';
import { CatImage, Breed, FavoriteCat } from '../types';

const API_KEY = 'live_YOUR_API_KEY_HERE'; // TODO: Add your API key from thecatapi.com
const BASE_URL = 'https://api.thecatapi.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export const catApi = {
  // Get random cat images
  getRandomCats: async (limit: number = 10): Promise<CatImage[]> => {
    const response = await api.get(`/images/search?limit=${limit}&has_breeds=1`);
    return response.data;
  },

  // Get specific cat image by ID
  getCatById: async (imageId: string): Promise<CatImage> => {
    const response = await api.get(`/images/${imageId}`);
    return response.data;
  },

  // Get all cat breeds
  getBreeds: async (): Promise<Breed[]> => {
    const response = await api.get('/breeds');
    return response.data;
  },

  // Get images for a specific breed
  getImagesByBreed: async (breedId: string, limit: number = 8): Promise<CatImage[]> => {
    const response = await api.get(`/images/search?breed_ids=${breedId}&limit=${limit}`);
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