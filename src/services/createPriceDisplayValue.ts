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
  const formatter = new Intl.NumberFormat(language || 'en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: !isDecimal ? 0 : 2,
    maximumFractionDigits: 2,
  });

  try {
    return formatter.format(amount);
  } catch (error) {
    if (error.indexOf('Currency') > 0) {
      throw error;
    }
    return formatter.format(amount);
  }
};
