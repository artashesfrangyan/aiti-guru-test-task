import { apiClient } from '@shared/api/client';
import { Product, ProductsResponse } from '../model/types';

export const productApi = {
  getProducts: async (): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products?limit=100');
    return data;
  },
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>(`/products/search?q=${query}`);
    return data;
  },
  addProduct: async (product: Omit<Product, 'id'>) => {
    const { data } = await apiClient.post('/products/add', {
      title: product.title,
      price: product.price,
      brand: product.brand,
      sku: product.sku,
      category: product.category || 'general',
      thumbnail: product.thumbnail || '',
    });
    return data as Product;
  },
  updateProduct: async (productId: number, updates: Partial<Omit<Product, 'id'>>) => {
    const { data } = await apiClient.put(`/products/${productId}`, {
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.brand !== undefined && { brand: updates.brand }),
      ...(updates.sku !== undefined && { sku: updates.sku }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.thumbnail !== undefined && { thumbnail: updates.thumbnail }),
    });
    return data as Product;
  },
  deleteProduct: async (productId: number) => {
    const { data } = await apiClient.delete(`/products/${productId}`);
    return data;
  },
};
