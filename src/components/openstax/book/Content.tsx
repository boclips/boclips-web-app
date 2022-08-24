import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { Chapter } from 'src/components/openstax/book/Chapter';
import { Header } from 'src/components/openstax/book/Header';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

export const Content = ({ book }: Props) => {
  return (
    <main
      aria-label={`Content for ${book.title}`}
      tabIndex={-1}
      className={s.main}
    >
      <Header bookTitle={book.title} />
      {book.chapters.map((chapter) => (
        <Chapter chapter={chapter} />
      ))}
    </main>
  );
};
