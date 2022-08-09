import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { OpenstaxBookSection } from 'src/components/openstax/book/OpenstaxBookSection';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { OpenstaxBook } from 'src/types/OpenstaxBook';

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
        <>
          <Typography.H2 size="sm" className="text-gray-700">
            {chapter.displayLabel}
          </Typography.H2>
          {chapter.sections.map((section) => (
            <OpenstaxBookSection section={section} />
          ))}
        </>
      ))}
    </main>
  );
};
