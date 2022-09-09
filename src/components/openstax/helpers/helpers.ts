const INITIAL_CHAPTER_NUMBER = 1;

type Location = { hash: string };

export const selectedChapterNumber = (location: Location) =>
  location.hash.length > 0
    ? Number(location.hash.split('-')[1])
    : INITIAL_CHAPTER_NUMBER;
