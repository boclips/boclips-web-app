import { Typography } from '@boclips-ui/typography';
import React from 'react';
import {
  Book,
  Chapter,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { OpenstaxBookSection } from 'src/components/openstax/book/OpenstaxBookSection';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';

interface Props {
  book: Book;
}

export const OpenstaxBookContent = ({ book }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';

  const formatChapterTitle = (chapter: Chapter) =>
    `Chapter ${chapter.number}: ${chapter.title}`;
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
            {formatChapterTitle(chapter)}
          </Typography.H2>
          {chapter.sections.map((section) => (
            <OpenstaxBookSection
              section={section}
              chapterNumber={chapter.number}
            />
          ))}
        </>
      ))}
    </main>
  );
};
