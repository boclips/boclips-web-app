import {
  OpenstaxBook,
  OpenstaxChapter,
  OpenstaxSection,
} from 'src/types/OpenstaxBook';
import { TargetInfo } from 'src/components/explore/theme/TargetElement';

const selectedChapterIndex = (locationHash: string): number => {
  const matchedChapterIndex = locationHash.match('chapter-(\\d+)-*.*');
  return matchedChapterIndex ? Number(matchedChapterIndex[1]) : 0;
};

export const getSelectedChapter = (
  book: OpenstaxBook,
  sectionLink: string,
): OpenstaxChapter => {
  const chapterIndex = selectedChapterIndex(sectionLink);
  const foundChapter = book?.topics.find(
    (chapter) => chapter.index === chapterIndex,
  );

  return foundChapter || book.topics[0];
};
export const getSelectedChapterElement = (
  book: OpenstaxBook,
  sectionLink: string,
): TargetInfo => {
  const chapter = getSelectedChapter(book, sectionLink);
  if (chapter === undefined) return undefined;

  const defaultFirstElement = defaultChapterElementInfo(chapter);
  let matchingElement;

  if (sectionLink.match('chapter-\\d+-section-\\d+$')) {
    const sectionIndex = Number(sectionLink.split('-')[3]);
    const foundSection = chapter.targets.find(
      (section) => section.index === sectionIndex,
    );

    matchingElement = sectionInfo(chapter, foundSection);
  }

  return matchingElement !== undefined ? matchingElement : defaultFirstElement;
};

const defaultChapterElementInfo = (
  chapter: OpenstaxChapter | null,
): TargetInfo => {
  if (chapter?.targets && chapter.targets.length !== 0) {
    return sectionInfo(chapter, chapter.targets[0]);
  }

  return undefined;
};

export const firstChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
): TargetInfo => {
  const chapter = getSelectedChapter(book, sectionLink);
  return defaultChapterElementInfo(chapter);
};

export const sectionInfo = (
  chapter: OpenstaxChapter,
  section: OpenstaxSection | undefined,
): TargetInfo => {
  if (section === undefined) return undefined;

  return {
    id: `chapter-${chapter.index}-section-${section.index}`,
    title: section.title,
    videos: section.videos,
  };
};

export const getPreviousChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
): TargetInfo => getChapterElementInfo(book, sectionLink, -1);

export const getNextChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
): TargetInfo => getChapterElementInfo(book, sectionLink, +1);

const getChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
  offset: number,
) => {
  const selectedElement = getSelectedChapterElement(book, sectionLink);
  const allElements = getAllElementsInCurrentChapter(book, sectionLink);

  const index = allElements.findIndex((it) => it.id === selectedElement.id);

  const effectiveIndex = ensureIndex(index + offset, allElements);
  return allElements[effectiveIndex];
};

const ensureIndex = (value: number, array: unknown[]) =>
  Math.min(Math.max(value, 0), array.length - 1);

export const getAllSectionsInChapter = (
  chapter: OpenstaxChapter,
): TargetInfo[] => {
  if (!chapter) return [];

  return chapter.targets
    .map((it) => sectionInfo(chapter, it))
    .filter((it) => it);
};

export const getAllElementsInCurrentChapter = (
  book: OpenstaxBook,
  sectionLink: string,
): TargetInfo[] => {
  const chapter = getSelectedChapter(book, sectionLink);
  if (chapter === undefined) return [];

  return getAllSectionsInChapter(chapter);
};

export const getNextChapterId = (
  book: OpenstaxBook,
  sectionLink: string,
): string => getChapterId(book, sectionLink, +1);

export const getPreviousChapterId = (
  book: OpenstaxBook,
  sectionLink: string,
): string => getChapterId(book, sectionLink, -1);

const getChapterId = (
  book: OpenstaxBook,
  sectionLink: string,
  offset: number,
) => {
  const index = selectedChapterIndex(sectionLink);
  const effectiveIndex = ensureIndex(index + offset, book.topics);
  return `chapter-${effectiveIndex}`;
};
