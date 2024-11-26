import { getBrowserLocale } from '@src/services/getBrowserLocale';

export interface DateFormatProps {
  monthFormat?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
}
const getFormattedDate = (
  date: Date,
  { monthFormat = 'short' }: DateFormatProps,
) => {
  const locale = getBrowserLocale();
  const month = date.toLocaleDateString(locale, { month: `${monthFormat}` });
  const year = date.toLocaleDateString(locale, { year: 'numeric' });
  const day = date.toLocaleDateString(locale, { day: '2-digit' });
  return `${day} ${month} ${year}`;
};

export default getFormattedDate;
