import { useEffect, useState, RefObject } from 'react';

interface UseDynamicPageSizeOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  rowHeight?: number;
  minPageSize?: number;
  headerHeight?: number;
}

export const useDynamicPageSize = ({
  containerRef,
  rowHeight = 71,
  minPageSize = 1,
  headerHeight = 0,
}: UseDynamicPageSizeOptions): number => {
  const [pageSize, setPageSize] = useState(minPageSize);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculatePageSize = () => {
      const containerHeight = container.clientHeight;
      const availableHeight = containerHeight - headerHeight;
      const calculatedSize = Math.max(minPageSize, Math.floor(availableHeight / rowHeight));
      setPageSize(calculatedSize);
    };

    calculatePageSize();

    const observer = new ResizeObserver(calculatePageSize);
    observer.observe(container);

    window.addEventListener('resize', calculatePageSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculatePageSize);
    };
  }, [containerRef, rowHeight, minPageSize, headerHeight]);

  return pageSize;
};
