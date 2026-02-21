export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
  category: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = 'title' | 'price' | 'rating' | 'brand';
export type SortOrder = 'asc' | 'desc';
