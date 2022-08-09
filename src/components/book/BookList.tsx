import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { BookCard } from './BookCard';

interface Props {
  books: OpenstaxBook[];
}
export const BookList = ({ books }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-2 pb-12 pt-2 md:grid-cols-2 lg:gap-x-6 lg:gap-y-4 lg:pt-4">
      {books?.map((it) => (
        <BookCard key={it.id} book={it} />
      ))}
    </div>
  );
};
