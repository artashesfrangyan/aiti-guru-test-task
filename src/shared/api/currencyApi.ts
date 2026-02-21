interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const currencyApi = {
  getExchangeRates: async (): Promise<Record<string, number>> => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const data: ExchangeRateResponse = await response.json();
      const invertedRates: Record<string, number> = {};
      
      Object.entries(data.rates).forEach(([currency, rate]) => {
        if (rate !== 0) {
          invertedRates[currency] = 1 / rate;
        }
      });
      
      return invertedRates;
    } catch (error) {
      console.warn('Fallback rates used:', error);
      return { USD: 90, EUR: 100, GBP: 110, JPY: 0.65, CNY: 12.5, INR: 1.08, RUB: 1 };
    }
  },
};
