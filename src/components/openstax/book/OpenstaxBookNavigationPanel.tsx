import { Typography } from '@boclips-ui/typography';
import React from 'react';
import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';

interface Props {
  book: Book;
}

export const OpenstaxBookNavigationPanel = ({ book }: Props) => {
  const formatChapterTitle = (chapter: Chapter) =>
    `Chapter ${chapter.number}: ${chapter.title}`;

  const formatSectionTitle = (chapter: Chapter, section: Section) =>
    `${chapter.number}.${section.number} ${section.title}`;

  const videoCountLabel = (chapter: Chapter) => {
    const chapterVideoCount = chapter.videos?.length;
    const sectionVideoCount = chapter.sections
      .map((section) => section.videos?.length)
      .reduce((lengthOne, lengthTwo) => lengthOne + lengthTwo, 0);

    const videoCount = chapterVideoCount + sectionVideoCount;
    const label = videoCount === 1 ? `video` : `videos`;

    return `${videoCount} ${label}`;
  };

  return (
    <div className="col-start-2 col-end-8">
      <Typography.H1 size="md" className="text-gray-900">
        {book.title}
      </Typography.H1>

      <div className="mt-8">
        {book.chapters.map((chapter) => (
          <>
            <Typography.H2 size="sm" className="text-gray-700 pt-4">
              {formatChapterTitle(chapter)}
            </Typography.H2>

            <div className="text-gray-700 mb-2">{videoCountLabel(chapter)}</div>

            {chapter.sections.map((section) => (
              <Typography.H3
                size="xs"
                className="text-gray-800 !font-normal py-2"
              >
                {formatSectionTitle(chapter, section)}
              </Typography.H3>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};
