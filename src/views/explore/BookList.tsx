import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import React from 'react';
import { BookCard } from './BookCard';

interface Props {
  books: Book[];
}
export const BookList = ({ books }: Props) => {
  return (
    <div className="bg-blue-100 gap-0 px-16 pt-4">
      {books?.map((it) => (
        <BookCard book={it} />
      ))}
    </div>
  );
};
