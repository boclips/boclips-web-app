const INITIAL_CHAPTER_NUMBER = 1;

export const selectedChapterNumber = (locationHash: string) =>
  locationHash.length > 0
    ? Number(locationHash.split('-')[1])
    : INITIAL_CHAPTER_NUMBER;
