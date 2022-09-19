import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import c from 'classnames';
import BookCardSkeleton from 'src/components/openstax/bookList/BookCardSkeleton';
import s from './style.module.less';
import { BookCard } from './BookCard';

interface Props {
  books: OpenstaxBook[];
  isLoading: boolean;
}

const BookCards = ({ books }: { books: OpenstaxBook[] }) => {
  return (
    <>
      {books?.map((it) => (
        <BookCard key={it.id} book={it} />
      ))}
    </>
  );
};

export const BookList = ({ books, isLoading }: Props) => {
  return (
    <main
      className={c(
        s.bookList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      {isLoading ? <BookCardSkeleton /> : <BookCards books={books} />}
    </main>
  );
};
