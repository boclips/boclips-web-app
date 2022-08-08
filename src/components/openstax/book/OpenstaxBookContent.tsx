import { Typography } from '@boclips-ui/typography';
import React from 'react';
import {
  Book,
  Chapter,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { OpenstaxBookSection } from 'src/components/openstax/book/OpenstaxBookSection';

interface Props {
  book: Book;
}

export const OpenstaxBookContent = ({ book }: Props) => {
  const formatChapterTitle = (chapter: Chapter) =>
    `Chapter ${chapter.number}: ${chapter.title}`;
  return (
    <main
      aria-label={`Content for ${book.title}`}
      tabIndex={-1}
      className="col-start-8 col-end-26"
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
