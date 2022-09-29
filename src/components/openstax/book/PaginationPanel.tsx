import React from 'react';
import {
  getAllSectionsInChapter,
  getSelectedChapterElement,
  selectedChapterNumber,
} from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import { useLocation } from 'react-router-dom';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import {
  NextChapterButton,
  NextSectionButton,
  PreviousChapterButton,
  PreviousSectionButton,
} from 'src/components/openstax/book/PaginationButton';

interface Props {
  book: OpenstaxBook;
}

const PaginationPanel = ({ book }: Props) => {
  const location = useLocation();
  const currentSection = getSelectedChapterElement(book, location.hash);
  const allSectionsInChapter = getAllSectionsInChapter(book, location.hash);
  const currentChapterNumber = selectedChapterNumber(location.hash);

  function first<T>(array: T[]): T {
    return array[0];
  }

  function last<T>(array: T[]): T {
    return array[array.length - 1];
  }

  const showNextChapterButton = () =>
    !showNextSectionButton() &&
    currentChapterNumber < last(book.chapters).number;

  const showPrevChapterButton = () =>
    !showPrevSectionButton() &&
    currentChapterNumber > first(book.chapters).number;

  const showNextSectionButton = () =>
    allSectionsInChapter.length &&
    currentSection.id !== last(allSectionsInChapter).id;

  const showPrevSectionButton = () =>
    allSectionsInChapter.length &&
    currentSection.id !== first(allSectionsInChapter).id;

  return (
    <div className="flex">
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
