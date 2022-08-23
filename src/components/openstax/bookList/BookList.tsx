import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import c from 'classnames';
import s from './style.module.less';
import { BookCard } from './BookCard';

interface Props {
  books: OpenstaxBook[];
}
export const BookList = ({ books }: Props) => {
  return (
    <main
      className={c(
        s.bookList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      {books?.map((it) => (
        <BookCard key={it.id} book={it} />
      ))}
    </main>
  );
};
