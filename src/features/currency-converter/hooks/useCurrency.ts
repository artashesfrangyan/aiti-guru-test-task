import { useMemo } from 'react';
import { useCurrencyStore } from '../model/store';
import { convertToRubles, getRate } from '../lib/converter';
import { Currency } from '../model/types';

export const useConvertToRubles = (price: number, currency: Currency = 'USD') => {
  const { rates, isLoading } = useCurrencyStore();

  return useMemo(() => {
    const rate = getRate(currency, rates);
    return {
      priceInRubles: convertToRubles(price, rates, currency),
      exchangeRate: rate,
      isLoading,
    };
  }, [price, currency, rates, isLoading]);
};

export const useExchangeRates = () => {
  const { rates, isLoading, fetchRates } = useCurrencyStore();
  return { rates, isLoading, fetchRates };
};
