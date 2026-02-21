import { create } from 'zustand';
import { Product, SortField, SortOrder } from './types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  sortField: SortField | null;
  sortOrder: SortOrder;
  selectedProductIds: Set<number>;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: number, updates: Partial<Product>) => void;
  deleteProduct: (productId: number) => void;
  setLoading: (isLoading: boolean) => void;
  setSorting: (field: SortField) => void;
  toggleProductSelection: (productId: number) => void;
  addToSelection: (productIds: number[]) => void;
  removeFromSelection: (productIds: number[]) => void;
  clearSelection: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  sortField: null,
  sortOrder: 'asc',
  selectedProductIds: new Set(),
  setProducts: (products: Product[]) => {
    set({ products, filteredProducts: products });
  },
  addProduct: (product: Product) => {
    const { products } = get();
    const newProducts = [product, ...products];
    set({ products: newProducts, filteredProducts: newProducts });
  },
  updateProduct: (productId: number, updates: Partial<Product>) => {
    const { products } = get();
    const newProducts = products.map(p => p.id === productId ? { ...p, ...updates } : p);
    set({ products: newProducts, filteredProducts: newProducts });
  },
  deleteProduct: (productId: number) => {
    const { products, selectedProductIds } = get();
    const newProducts = products.filter(p => p.id !== productId);
    const newSelected = new Set(selectedProductIds);
    newSelected.delete(productId);
    set({ products: newProducts, filteredProducts: newProducts, selectedProductIds: newSelected });
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
  toggleProductSelection: (productId: number) => {
    const { selectedProductIds } = get();
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    set({ selectedProductIds: newSelected });
  },
  addToSelection: (productIds: number[]) => {
    const { selectedProductIds } = get();
    const newSelected = new Set(selectedProductIds);
    productIds.forEach(id => newSelected.add(id));
    set({ selectedProductIds: newSelected });
  },
  removeFromSelection: (productIds: number[]) => {
    const { selectedProductIds } = get();
    const newSelected = new Set(selectedProductIds);
    productIds.forEach(id => newSelected.delete(id));
    set({ selectedProductIds: newSelected });
  },
  clearSelection: () => {
    set({ selectedProductIds: new Set() });
  },
  setSorting: (field: SortField) => {
    const { sortField, sortOrder, filteredProducts } = get();
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    
    const sorted = [...filteredProducts].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return newOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return newOrder === 'asc' 
        ? (aVal as number) - (bVal as number) 
        : (bVal as number) - (aVal as number);
    });
    
    set({ sortField: field, sortOrder: newOrder, filteredProducts: sorted });
  },
}));