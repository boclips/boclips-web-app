import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { Chapter } from 'src/components/openstax/book/Chapter';
import { Header } from 'src/components/openstax/book/Header';
import { useLocation } from 'react-router-dom';
import { selectedChapterNumber } from 'src/components/openstax/helpers/helpers';
import PaginationButtons from 'src/components/openstax/book/PaginationButtons';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

export const Content = ({ book }: Props) => {
  const location = useLocation();

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
