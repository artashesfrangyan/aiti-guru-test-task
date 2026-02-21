import { Currency } from '../model/types';

export const convertToRubles = (price: number, rates: Record<string, number>, currency: Currency = 'USD'): number => {
  const rate = rates[currency] || 1;
  return price * rate;
};

export const getRate = (currency: Currency, rates: Record<string, number>): number => {
  return rates[currency] || 0;
};
