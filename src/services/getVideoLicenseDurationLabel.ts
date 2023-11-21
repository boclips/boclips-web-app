export const getVideoPageLicenseDurationLabel = (
  maxDuration?: number,
): string => {
  if (maxDuration === undefined) return 'Unavailable';
  if (maxDuration === null || maxDuration >= 10) return '10+ years';

  return maxDuration === 1 ? `1 year` : `${maxDuration} years`;
};
