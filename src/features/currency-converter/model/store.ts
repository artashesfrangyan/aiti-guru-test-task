import { create } from 'zustand';
import { currencyApi } from '@shared/api/currencyApi';
import { CurrencyState } from './types';

interface CurrencyStore extends CurrencyState {
  fetchRates: () => Promise<void>;
}

const defaultRates = { USD: 90, EUR: 100, GBP: 110, JPY: 0.65, CNY: 12.5, INR: 1.08, RUB: 1 };

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  rates: defaultRates,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchRates: async () => {
    set({ isLoading: true, error: null });
    try {
      const rates = await currencyApi.getExchangeRates();
      set({ rates, isLoading: false, lastUpdated: new Date().toISOString() });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error loading rates';
      set({ error: msg, isLoading: false });
    }
  },
}));
