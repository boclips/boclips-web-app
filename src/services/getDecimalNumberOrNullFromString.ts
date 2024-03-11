export const getDecimalNumberOrNullFromString = (str?: string) => {
  const value = parseInt(str, 10);
  return !Number.isNaN(value) ? value : null;
};
