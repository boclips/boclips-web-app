import React from 'react';
import c from 'classnames';
import BookCardSkeleton from 'src/components/openstax/bookList/BookCardSkeleton';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import s from './style.module.less';
import { BookCard } from './BookCard';

interface Props {
  books: OpenstaxBook[];
  isLoading: boolean;
}

const BookCards = ({ books }: Omit<Props, 'isLoading'>) => {
  const booksWithMappings = books?.filter((it) => it.subject.length > 0);
  return (
    <>
      {booksWithMappings.map((it) => (
        <BookCard key={it.id} theme={it} />
      ))}
    </>
  );
};

export const BookList = ({ books, isLoading }: Props) => {
  return (
    <section
      className={c(
        s.bookList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      {isLoading ? <BookCardSkeleton /> : <BookCards books={books} />}
    </section>
  );
};
