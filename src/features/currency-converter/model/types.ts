export interface CurrencyState {
  rates: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'RUB';
