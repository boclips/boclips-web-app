import React, { useEffect, useState } from 'react';
import { OpenstaxBook, OpenstaxChapter } from 'src/types/OpenstaxBook';
import { Header } from 'src/components/openstax/book/Header';
import { useLocation } from 'react-router-dom';
import {
  getSelectedChapter,
  getSelectedChapterElement,
} from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import PaginationPanel from 'src/components/openstax/book/PaginationPanel';
import {
  ChapterElement,
  ChapterElementInfo,
} from 'src/components/openstax/book/ChapterElement';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

export const Content = ({ book }: Props) => {
  const location = useLocation();
  const [selectedChapter, setSelectedChapter] = useState<OpenstaxChapter>(
    getSelectedChapter(book, 'chapter-1'),
  );

  const [selectedChapterElement, setSelectedChapterElement] =
    useState<ChapterElementInfo>({
      displayLabel: '',
      id: '',
      videos: [],
    });

  useEffect(() => {
    const newSectionLink = location.hash.replace('#', '');
    setSelectedChapter(getSelectedChapter(book, newSectionLink));
    setSelectedChapterElement(getSelectedChapterElement(book, newSectionLink));

    window.scrollTo({ top: 0 });
  }, [location.hash]);

  return (
    <main
      aria-label={`Content for ${book.title}`}
      tabIndex={-1}
      className={s.main}
    >
      <Header
        bookTitle={book.title}
        chapterTitle={selectedChapter.displayLabel}
      />

      <ChapterElement info={selectedChapterElement} />
      <PaginationPanel book={book} />
    </main>
  );
};
