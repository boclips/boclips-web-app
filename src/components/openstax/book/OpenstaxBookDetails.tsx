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

export const OpenstaxBookDetails = ({ book }: Props) => {
  const formatChapterTitle = (chapter: Chapter) =>
    `Chapter ${chapter.number}: ${chapter.title}`;
  return (
    <>
      <Typography.H1 size="md">{book.title}</Typography.H1>
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
    </>
  );
};
