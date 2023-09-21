export const getVideoOrderLicenseDurationLabel = (
  maxDuration?: number,
): string => {
  if (!maxDuration || maxDuration >= 10) return 'Can be licensed for 10+ years';

  return maxDuration === 1
    ? `Can be licensed for a maximum of 1 year`
    : `Can be licensed for a maximum of ${maxDuration} years`;
};

export const getVideoPageLicenseDurationLabel = (
  maxDuration?: number,
): string => {
  if (!maxDuration || maxDuration >= 10) return '10+ years';

  return maxDuration === 1 ? `1 year` : `${maxDuration} years`;
};
