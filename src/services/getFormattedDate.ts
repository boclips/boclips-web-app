import { getBrowserLocale } from 'src/services/getBrowserLocale';

const getFormattedDate = (date: Date) => {
  const locale = getBrowserLocale();
  const month = date.toLocaleDateString(locale, { month: 'short' });
  const year = date.toLocaleDateString(locale, { year: 'numeric' });
  const day = date.toLocaleDateString(locale, { day: '2-digit' });
  return `${day} ${month} ${year}`;
};

export default getFormattedDate;
