import { currencyFormat } from 'simple-currency-format/dist/simple-currency-format.cjs.production.min';

export const createPriceDisplayValue = (
  amount?: number,
  currency?: any,
  language?: any,
): string | null => {
  if (!currency) {
    return null;
  }
  const isDecimal = amount % 1 !== 0;
  try {
    return currencyFormat(
      amount,
      language || 'en-US',
      currency,
      isDecimal ? 2 : 0,
    );
  } catch (error) {
    if (error.indexOf('Currency') > 0) {
      throw error;
    }
    return currencyFormat(amount, 'en-US', currency, isDecimal ? 2 : 0);
  }
};
