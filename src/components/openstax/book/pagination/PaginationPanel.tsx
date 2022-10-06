import React from 'react';
import {
  getAllSectionsInChapter,
  getSelectedChapter,
  getSelectedChapterElement,
} from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import { useLocation } from 'react-router-dom';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import {
  NextChapterButton,
  NextSectionButton,
  PreviousChapterButton,
  PreviousSectionButton,
} from 'src/components/openstax/book/pagination/PaginationButton';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const PaginationPanel = ({ book }: Props) => {
  const location = useLocation();
  const currentSection = getSelectedChapterElement(book, location.hash);
  const currentChapter = getSelectedChapter(book, location.hash);
  const allSectionsInChapter = getAllSectionsInChapter(currentChapter);

  function first<T>(array: T[]): T {
    return array[0];
  }

  function last<T>(array: T[]): T {
    return array[array.length - 1];
  }

  const showNextChapterButton = () =>
    !showNextSectionButton() &&
    currentChapter?.number < last(book.chapters).number;

  const showPrevChapterButton = () =>
    !showPrevSectionButton() &&
    currentChapter?.number > first(book.chapters).number;

  const showNextSectionButton = () =>
    allSectionsInChapter.length &&
    currentSection.id !== last(allSectionsInChapter).id;

  const showPrevSectionButton = () =>
    allSectionsInChapter.length &&
    currentSection.id !== first(allSectionsInChapter).id;

  return (
    <div className={s.paginationPanel}>
      {showPrevSectionButton() && (
        <PreviousSectionButton book={book} hash={location.hash} />
      )}

      {showPrevChapterButton() && (
        <PreviousChapterButton book={book} hash={location.hash} />
      )}

      {showNextSectionButton() && (
        <NextSectionButton book={book} hash={location.hash} />
      )}

      {showNextChapterButton() && (
        <NextChapterButton book={book} hash={location.hash} />
      )}
    </div>
  );
};

export default PaginationPanel;
