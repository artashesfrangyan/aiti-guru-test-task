export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

export const formatRating = (rating: number | undefined | null): string => 
  rating != null ? `${rating.toFixed(1)}/5` : 'N/A';
