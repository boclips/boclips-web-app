import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxBookChapter } from 'src/components/openstax/book/OpenstaxBookChapter';

interface Props {
  book: OpenstaxBook;
}

export const OpenstaxBookContent = ({ book }: Props) => {
  return (
    <main aria-label={`Content for ${book.title}`} tabIndex={-1}>
      {book.chapters.map((chapter) => (
        <OpenstaxBookChapter chapter={chapter} />
      ))}
    </main>
  );
};
