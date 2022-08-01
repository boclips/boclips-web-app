import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import React from 'react';
import { BookCard } from './BookCard';

interface Props {
  books: Book[];
}
export const BookList = ({ books }: Props) => {
  return (
    <div className="grid grid-cols-container lg:gap-x-6 bg-blue-100 pb-12">
      <div className="col-start-2 col-end-26 col-span-24">
        {books?.map((it) => (
          <BookCard book={it} />
        ))}
      </div>
    </div>
  );
};
