import React from 'react';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxBookChapter } from 'src/components/openstax/book/OpenstaxBookChapter';

interface Props {
  book: OpenstaxBook;
}

export const OpenstaxBookContent = ({ book }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';

  return (
    <main
      aria-label={`Content for ${book.title}`}
      tabIndex={-1}
      className={
        isNotDesktop ? 'col-start-2 col-end-26' : 'col-start-8 col-end-26'
      }
    >
      {book.chapters.map((chapter) => (
        <OpenstaxBookChapter chapter={chapter} />
      ))}
    </main>
  );
};
