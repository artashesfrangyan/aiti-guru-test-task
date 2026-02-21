import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = (): number[] => {
    const maxVisiblePages = Math.min(5, totalPages);
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageBtn}
        aria-label="Предыдущая страница"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.9422 15.8078C13.0003 15.8659 13.0463 15.9348 13.0777 16.0107C13.1092 16.0865 13.1253 16.1679 13.1253 16.25C13.1253 16.3321 13.1092 16.4134 13.0777 16.4893C13.0463 16.5652 13.0003 16.6341 12.9422 16.6922C12.8841 16.7502 12.8152 16.7963 12.7393 16.8277C12.6634 16.8592 12.5821 16.8753 12.5 16.8753C12.4179 16.8753 12.3366 16.8592 12.2607 16.8277C12.1848 16.7963 12.1159 16.7502 12.0578 16.6922L5.80781 10.4422C5.7497 10.3841 5.7036 10.3152 5.67215 10.2393C5.6407 10.1634 5.62451 10.0821 5.62451 9.99998C5.62451 9.91785 5.6407 9.83652 5.67215 9.76064C5.7036 9.68477 5.7497 9.61584 5.80781 9.55779L12.0578 3.30779C12.1751 3.19052 12.3341 3.12463 12.5 3.12463C12.6659 3.12463 12.8249 3.19052 12.9422 3.30779C13.0595 3.42507 13.1253 3.58413 13.1253 3.74998C13.1253 3.91583 13.0595 4.07489 12.9422 4.19217L7.13359 9.99998L12.9422 15.8078Z" fill="#B2B3B9"/>
        </svg>
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageBtn}
        aria-label="Следующая страница"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.1922 10.4422L7.9422 16.6922C7.88413 16.7502 7.81519 16.7963 7.73932 16.8277C7.66345 16.8592 7.58213 16.8753 7.50001 16.8753C7.41789 16.8753 7.33657 16.8592 7.2607 16.8277C7.18483 16.7963 7.11589 16.7502 7.05782 16.6922C6.99976 16.6341 6.95369 16.5652 6.92227 16.4893C6.89084 16.4134 6.87466 16.3321 6.87466 16.25C6.87466 16.1679 6.89084 16.0865 6.92227 16.0107C6.95369 15.9348 6.99976 15.8659 7.05782 15.8078L12.8664 9.99998L7.05782 4.19217C6.94055 4.07489 6.87466 3.91583 6.87466 3.74998C6.87466 3.58413 6.94055 3.42507 7.05782 3.30779C7.1751 3.19052 7.33416 3.12463 7.50001 3.12463C7.66586 3.12463 7.82492 3.19052 7.9422 3.30779L14.1922 9.55779C14.2503 9.61584 14.2964 9.68477 14.3279 9.76064C14.3593 9.83652 14.3755 9.91785 14.3755 9.99998C14.3755 10.0821 14.3593 10.1634 14.3279 10.2393C14.2964 10.3152 14.2503 10.3841 14.1922 10.4422Z" fill="#B2B3B9"/>
        </svg>
      </button>
    </div>
  );
};
