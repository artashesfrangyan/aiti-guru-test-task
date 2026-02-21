import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProductStore } from '@entities/product/model/store';
import { Product } from '@entities/product/model/types';
import { productApi } from '@entities/product/api/productApi';
import { Input } from '@shared/ui/input/Input';
import { Button } from '@shared/ui/button/Button';
import styles from './ProductModal.module.scss';

// Генератор уникальных отрицательных ID для локальных товаров
// Используем отрицательные числа, чтобы избежать коллизий с реальными ID из API
let localProductIdCounter = -1;
const generateLocalProductId = (): number => {
  return localProductIdCounter--;
};

interface ProductFormData {
  title: string;
  price: number;
  brand: string;
  sku: string;
}

interface Props {
  mode: 'add' | 'edit';
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductModal = ({ mode, product, onClose, onSuccess }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product ? {
      title: product.title,
      price: product.price,
      brand: product.brand,
      sku: product.sku,
    } : undefined,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const isAddMode = mode === 'add';
  const title = isAddMode ? 'Добавить товар' : 'Редактировать товар';
  const submitText = isAddMode ? 'Добавить' : 'Сохранить';
  const loadingText = isAddMode ? 'Добавление...' : 'Сохранение...';

  const handleAdd = async (data: ProductFormData) => {
    try {
      const newProduct = await productApi.addProduct({
        title: data.title,
        price: data.price,
        brand: data.brand,
        sku: data.sku,
        rating: 0,
        category: 'general',
        thumbnail: '',
      });
      addProduct(newProduct);
    } catch {
      // Если API недоступен, добавляем локально с уникальным отрицательным ID
      const newProduct: Product = {
        id: generateLocalProductId(),
        title: data.title,
        price: data.price,
        brand: data.brand,
        sku: data.sku,
        rating: 0,
        category: 'general',
        thumbnail: '',
      };
      addProduct(newProduct);
    }
  };

  const handleEdit = async (data: ProductFormData, productId: number) => {
    try {
      await productApi.updateProduct(productId, data);
    } catch {
      // Если API недоступен, обновляем локально
    }
    updateProduct(productId, data);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      setApiError('');
      
      if (isAddMode) {
        await handleAdd(data);
      } else if (product) {
        await handleEdit(data, product.id);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Ошибка при ${isAddMode ? 'добавлении' : 'обновлении'} товара`;
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {apiError && (
            <div className={styles.apiError}>
              {apiError}
            </div>
          )}
          
          <Input
            label="Наименование"
            placeholder="Введите наименование"
            error={errors.title?.message}
            {...register('title', { required: 'Обязательное поле' })}
          />

          <Input
            label="Цена"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="Введите цену"
            error={errors.price?.message}
            {...register('price', { 
              required: 'Обязательное поле', 
              min: { value: 0, message: 'Цена должна быть положительной' }
            })}
          />

          <Input
            label="Вендор"
            placeholder="Введите вендора"
            error={errors.brand?.message}
            {...register('brand', { required: 'Обязательное поле' })}
          />

          <Input
            label="Артикул"
            placeholder="Введите артикул"
            error={errors.sku?.message}
            {...register('sku', { required: 'Обязательное поле' })}
          />

          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>
              Отмена
            </Button>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? loadingText : submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};