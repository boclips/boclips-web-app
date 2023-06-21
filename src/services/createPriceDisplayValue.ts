import { currencyFormat } from 'simple-currency-format';

export const createPriceDisplayValue = (
  amount?: number,
  currency?: any,
  language?: any,
): string => {
  if (!currency) {
    return null;
  }
  const isDecimal = amount % 1 !== 0;

  if (currency.toUpperCase() === 'CREDITS') {
    const creditAmount = isDecimal ? amount.toFixed(2) : amount;
    return creditAmount.toString();
  }

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
