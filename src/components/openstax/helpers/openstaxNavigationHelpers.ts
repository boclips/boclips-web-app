import {
  OpenstaxBook,
  OpenstaxChapter,
  OpenstaxSection,
} from 'src/types/OpenstaxBook';
import { ChapterElementInfo } from 'src/components/openstax/book/ChapterElement';

const INITIAL_CHAPTER_NUMBER = 1;

export const selectedChapterNumber = (locationHash: string): number =>
  locationHash.length > 0
    ? Number(locationHash.split('-')[1])
    : INITIAL_CHAPTER_NUMBER;

export const getSelectedChapter = (
  book: OpenstaxBook,
  sectionLink: string,
): OpenstaxChapter =>
  book.chapters.find(
    (chapter) => chapter.number === selectedChapterNumber(sectionLink),
  );

export const getSelectedChapterElement = (
  book: OpenstaxBook,
  sectionLink: string,
): ChapterElementInfo => {
  const chapter = getSelectedChapter(book, sectionLink);

  if (sectionLink.match('chapter-.*-overview')) {
    return chapterOverviewInfo(chapter);
  }
  if (sectionLink.match('chapter-.*-discussion-prompt')) {
    return discussionPromptInfo(chapter);
  }
  if (sectionLink.match('chapter-.*-section-.*')) {
    const sectionNumber = Number(sectionLink.split('-')[3]);
    const section = chapter.sections.find((it) => it.number === sectionNumber);
    return sectionInfo(chapter, section);
  }

  return defaultChapterElementInfo(chapter);
};

export const chapterOverviewInfo = (
  chapter: OpenstaxChapter,
): ChapterElementInfo => {
  return {
    id: `chapter-${chapter.number}`,
    displayLabel: chapter.chapterOverview.displayLabel,
    videos: chapter.chapterOverview.videos,
  };
};

export const discussionPromptInfo = (
  chapter: OpenstaxChapter,
): ChapterElementInfo => {
  return {
    id: `chapter-${chapter.number}-discussion-prompt`,
    displayLabel: chapter.discussionPrompt.displayLabel,
    videos: chapter.discussionPrompt.videos,
  };
};

const defaultChapterElementInfo = (
  chapter: OpenstaxChapter,
): ChapterElementInfo => {
  if (chapter.chapterOverview) {
    return chapterOverviewInfo(chapter);
  }

  if (chapter.discussionPrompt) {
    return discussionPromptInfo(chapter);
  }

  if (chapter.sections && chapter.sections.length !== 0) {
    return sectionInfo(chapter, chapter.sections[0]);
  }

  return {
    displayLabel: '',
    id: '',
    videos: [],
  };
};

export const firstChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
): ChapterElementInfo => {
  const chapter = getSelectedChapter(book, sectionLink);
  return defaultChapterElementInfo(chapter);
};

export const sectionInfo = (
  chapter: OpenstaxChapter,
  section: OpenstaxSection,
): ChapterElementInfo => {
  return {
    id: `chapter-${chapter.number}-section-${section.number}`,
    displayLabel: section.displayLabel,
    videos: section.videos,
  };
};

export const getPreviousChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
): ChapterElementInfo => getChapterElementInfo(book, sectionLink, -1);

export const getNextChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
): ChapterElementInfo => getChapterElementInfo(book, sectionLink, +1);

const getChapterElementInfo = (
  book: OpenstaxBook,
  sectionLink: string,
  offset: number,
) => {
  const selectedElement = getSelectedChapterElement(book, sectionLink);
  const allElements = getAllSectionsInChapter(book, sectionLink);

  const index = allElements.findIndex((it) => it.id === selectedElement.id);

  const effectiveIndex = ensureIndex(index + offset, allElements);
  return allElements[effectiveIndex];
};

const ensureIndex = (value: number, array: unknown[]) =>
  Math.min(Math.max(value, 0), array.length - 1);

export const getAllSectionsInChapter = (
  book: OpenstaxBook,
  sectionLink: string,
): ChapterElementInfo[] => {
  const chapter = getSelectedChapter(book, sectionLink);
  return [
    chapter.chapterOverview ? chapterOverviewInfo(chapter) : undefined,
    chapter.discussionPrompt ? discussionPromptInfo(chapter) : undefined,
    ...chapter.sections.map((it) => sectionInfo(chapter, it)),
  ].filter((it) => it);
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
  const index = selectedChapterIndex(book, sectionLink);
  const effectiveIndex = ensureIndex(index + offset, book.chapters);
  return `chapter-${book.chapters[effectiveIndex].number}`;
};

const selectedChapterIndex = (
  book: OpenstaxBook,
  sectionLink: string,
): number =>
  book.chapters.findIndex(
    (chapter) => chapter.number === selectedChapterNumber(sectionLink),
  );
