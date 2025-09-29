export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Breed[];
}

export interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  origin: string;
  life_span: string;
  wikipedia_url?: string;
  weight: {
    imperial: string;
    metric: string;
  };
}

export interface FavoriteCat extends CatImage {
  dateAdded: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}