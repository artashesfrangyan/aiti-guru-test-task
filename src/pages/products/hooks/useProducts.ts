import { useEffect } from 'react';
import { productApi } from '@entities/product/api/productApi';
import { useProductStore } from '@entities/product/model/store';

export const useProducts = () => {
  const { setProducts, setLoading, isLoading } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    setLoading(true);
    try {
      const data = await productApi.searchProducts(query);
      setProducts(data.products);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, searchProducts };
};
