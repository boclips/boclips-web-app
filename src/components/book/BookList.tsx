import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import React from 'react';
import { BookCard } from './BookCard';

interface Props {
  books: Book[];
}
export const BookList = ({ books }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-2 pb-12 pt-2 md:grid-cols-2 lg:gap-x-6 lg:gap-y-4 lg:pt-4">
      {books?.map((it) => (
        <BookCard book={it} />
      ))}
    </div>
  );
};
