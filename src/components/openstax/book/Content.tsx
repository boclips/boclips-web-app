import React, { useEffect } from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { Chapter } from 'src/components/openstax/book/Chapter';
import { Header } from 'src/components/openstax/book/Header';
import { useLocation } from 'react-router-dom';
import {
  selectedChapterNumber,
  scrollToSelectedSection,
} from 'src/components/openstax/helpers/helpers';
import PaginationButtons from 'src/components/openstax/book/PaginationButtons';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

export const Content = ({ book }: Props) => {
  const location = useLocation();
  const currentBreakpoint = useMediaBreakPoint();

  useEffect(() => {
    const newSectionLink = location.hash.replace('#', '');
    scrollToSelectedSection(newSectionLink, currentBreakpoint);
  }, [location.hash]);

  const getSelectedChapter = () =>
    book.chapters.find(
      (chapter) => chapter.number === selectedChapterNumber(location.hash),
    );

  return (
    <main
      aria-label={`Content for ${book.title}`}
      tabIndex={-1}
      className={s.main}
    >
      <Header bookTitle={book.title} />

      <Chapter chapter={getSelectedChapter()} />

      <PaginationButtons book={book} />
    </main>
  );
};
