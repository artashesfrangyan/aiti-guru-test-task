import { useState, useEffect } from 'react';
import { Product } from '@entities/product/model/types';
import { useProductStore } from '@entities/product/model/store';
import { productApi } from '@entities/product/api/productApi';
import { ProductTable } from '@widgets/product-table/ui/ProductTable';
import { ProductModal } from '@features/product/ui/ProductModal';
import { Toast } from '@shared/ui/Toast';
import { useDebounce } from '@shared/lib/hooks/useDebounce';
import { useExchangeRates } from '@features/currency-converter';
import { useProducts } from './hooks/useProducts';
import { SearchBar } from './ui/SearchBar';
import { Loader } from './ui/Loader';
import styles from './ProductsPage.module.scss';

export const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { isLoading, searchProducts } = useProducts();
  const { fetchRates } = useExchangeRates();

  useEffect(() => {
    fetchRates().catch(error => {
      console.warn('Failed to fetch exchange rates:', error);
    });
  }, [fetchRates]);

  const debouncedSearch = useDebounce(searchProducts, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      const { setProducts } = useProductStore.getState();
      const response = await productApi.getProducts();
      setProducts(response.products);
      setToastMessage('Товары обновлены');
      setShowToast(true);
    } catch (error) {
      console.error('Refresh error:', error);
      setToastMessage('Ошибка при обновлении товаров');
      setShowToast(true);
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleAddSuccess = () => {
    setToastMessage('Товар добавлен');
    setShowToast(true);
  };

  const handleEditSuccess = () => {
    setToastMessage('Товар обновлен');
    setEditingProduct(null);
    setShowToast(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.navLeft}>
          <h1>Товары</h1>
        </div>
        <div className={styles.navCenter}>
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>

      {isLoading ? <Loader /> : (
        <ProductTable 
          onEdit={handleEditProduct} 
          onRefresh={handleRefresh}
          refreshLoading={refreshLoading}
          onAddClick={() => setIsModalOpen(true)}
        />
      )}

      {isModalOpen && (
        <ProductModal
          mode="add"
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {editingProduct && (
        <ProductModal
          mode="edit"
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};