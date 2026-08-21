export const getBrowserLocale = () =>
  navigator.languages?.[0] ?? navigator.language;
