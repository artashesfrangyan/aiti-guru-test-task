import { useRef, useState, useMemo } from 'react';
import { useProductStore } from '@entities/product/model/store';
import { Product, SortField } from '@entities/product/model/types';
import { Pagination } from '@features/pagination/ui/Pagination';
import { Button } from '@shared/ui/button/Button';
import { ArrowsClockwiseIcon } from '@shared/ui/icons';
import { ProductRow } from './ProductRow';
import { useDynamicPageSize } from '../lib/useDynamicPageSize';
import styles from './ProductTable.module.scss';
import { Checkbox } from '@/shared/ui';
import clsx from 'clsx';

interface Props {
  onEdit?: (product: Product) => void;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  onAddClick?: () => void;
}

const getSortIcon = (current: SortField | null, sortField: SortField | null, sortOrder: 'asc' | 'desc'): string => {
  if (sortField !== current) return '↕';
  return sortOrder === 'asc' ? '↑' : '↓';
};

export const ProductTable = ({ onEdit, onRefresh, refreshLoading, onAddClick }: Props) => {
  const { filteredProducts, sortField, sortOrder, setSorting, selectedProductIds, toggleProductSelection, addToSelection, removeFromSelection } = useProductStore();
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);

  const itemsPerPage = useDynamicPageSize({
    containerRef: tableWrapperRef,
    rowHeight: 71,
    minPageSize: 5,
    headerHeight: 73, // thead height
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentPage = Math.max(1, Math.min(activePage, totalPages || 1));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProductIds.has(p.id));
  const isSomeSelected = paginatedProducts.some(p => selectedProductIds.has(p.id)) && !isAllSelected;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageIds = paginatedProducts.map(p => p.id);
    if (e.target.checked) {
      addToSelection(pageIds);
    } else {
      removeFromSelection(pageIds);
    }
  };

  const handleSort = (field: SortField) => setSorting(field);

  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Все позиции</h2>
        <div className={styles.headerControls}>
          <button 
            className={styles.refreshButton}
            onClick={onRefresh}
            disabled={refreshLoading}
            title="Обновить список товаров"
          >
            <ArrowsClockwiseIcon style={{ width: 22, height: 22 }} stroke="#515161" />
          </button>
          <Button className={styles.addButton} onClick={onAddClick}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2.0625C9.23233 2.0625 7.50436 2.58668 6.03459 3.56874C4.56483 4.55081 3.41929 5.94665 2.74283 7.57977C2.06637 9.21288 1.88938 11.0099 2.23424 12.7436C2.57909 14.4773 3.43031 16.0698 4.68024 17.3198C5.93017 18.5697 7.52268 19.4209 9.25638 19.7658C10.9901 20.1106 12.7871 19.9336 14.4202 19.2572C16.0534 18.5807 17.4492 17.4352 18.4313 15.9654C19.4133 14.4956 19.9375 12.7677 19.9375 11C19.935 8.6304 18.9926 6.35856 17.317 4.683C15.6414 3.00743 13.3696 2.065 11 2.0625ZM11 18.5625C9.50428 18.5625 8.04215 18.119 6.7985 17.288C5.55486 16.457 4.58555 15.2759 4.01316 13.894C3.44078 12.5122 3.29101 10.9916 3.58282 9.52463C3.87462 8.05765 4.59487 6.71014 5.65251 5.65251C6.71014 4.59487 8.05765 3.87461 9.52463 3.58281C10.9916 3.29101 12.5122 3.44077 13.894 4.01316C15.2759 4.58555 16.457 5.55485 17.288 6.7985C18.119 8.04215 18.5625 9.50428 18.5625 11C18.5602 13.005 17.7627 14.9272 16.345 16.345C14.9272 17.7627 13.005 18.5602 11 18.5625ZM15.125 11C15.125 11.1823 15.0526 11.3572 14.9236 11.4861C14.7947 11.6151 14.6198 11.6875 14.4375 11.6875H11.6875V14.4375C11.6875 14.6198 11.6151 14.7947 11.4861 14.9236C11.3572 15.0526 11.1823 15.125 11 15.125C10.8177 15.125 10.6428 15.0526 10.5139 14.9236C10.3849 14.7947 10.3125 14.6198 10.3125 14.4375V11.6875H7.5625C7.38017 11.6875 7.2053 11.6151 7.07637 11.4861C6.94744 11.3572 6.875 11.1823 6.875 11C6.875 10.8177 6.94744 10.6428 7.07637 10.5139C7.2053 10.3849 7.38017 10.3125 7.5625 10.3125H10.3125V7.5625C10.3125 7.38016 10.3849 7.2053 10.5139 7.07636C10.6428 6.94743 10.8177 6.875 11 6.875C11.1823 6.875 11.3572 6.94743 11.4861 7.07636C11.6151 7.2053 11.6875 7.38016 11.6875 7.5625V10.3125H14.4375C14.6198 10.3125 14.7947 10.3849 14.9236 10.5139C15.0526 10.6428 15.125 10.8177 15.125 11Z" fill="white"/>
            </svg>
            Добавить
          </Button>
        </div>
      </div>

      <div className={styles.tableWrapper} ref={tableWrapperRef}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={clsx(styles.row, isAllSelected && styles.selected)}>
              <th className={styles.cell} data-column="select">
                <Checkbox 
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th 
                className={`${styles.cell} ${styles.sortable}`}
                onClick={() => handleSort('title')}
                data-column="title"
              >
                Наименование {getSortIcon('title', sortField, sortOrder)}
              </th>
              <th 
                className={`${styles.cell} ${styles.sortable}`}
                onClick={() => handleSort('brand')}
                data-column="brand"
              >
                Вендор {getSortIcon('brand', sortField, sortOrder)}
              </th>
              <th className={styles.cell} data-column="sku">
                Артикул
              </th>
              <th 
                className={`${styles.cell} ${styles.sortable}`}
                onClick={() => handleSort('rating')}
                data-column="rating"
              >
                Оценка {getSortIcon('rating', sortField, sortOrder)}
              </th>
              <th 
                className={`${styles.cell} ${styles.sortable}`}
                onClick={() => handleSort('price')}
                data-column="price"
              >
                Цена, ₽ {getSortIcon('price', sortField, sortOrder)}
              </th>
              <th className={styles.cell} data-column="actions"></th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {paginatedProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                isSelected={selectedProductIds.has(product.id)}
                onSelect={toggleProductSelection}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.paginationInfo}>
          {filteredProducts.length > 0 ? (
            <>Показано <span className={styles.count}>{startItem}–{endItem}</span> из <span className={styles.count}>{filteredProducts.length}</span></>
          ) : (
            <>Нет товаров</>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setActivePage}
        />
      </div>
    </div>
  );
};