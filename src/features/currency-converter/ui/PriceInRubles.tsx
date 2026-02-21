import React from 'react';
import { useConvertToRubles } from '../hooks/useCurrency';
import { Currency } from '../model/types';
import { formatPrice } from '@shared/lib/utils/formatters';
import styles from './PriceInRubles.module.scss';

interface PriceInRublesProps {
  price: number;
  currency?: Currency;
}

export const PriceInRubles: React.FC<PriceInRublesProps> = ({
  price,
  currency = 'USD',
}) => {
  const { priceInRubles, exchangeRate } = useConvertToRubles(price, currency);

  // Разделяем цену на целую и дробную части
  const formattedPrice = formatPrice(priceInRubles);
  const parts = formattedPrice.split(',');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  return (
    <span 
      className={styles.price}
      title={`Курс: 1 ${currency} = ${formatPrice(exchangeRate)} ₽`}
    >
      {integerPart},<span className={styles.decimal}>{decimalPart}</span>
    </span>
  );
};
