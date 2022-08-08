import { Typography } from '@boclips-ui/typography';
import React from 'react';
import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import s from 'src/components/openstax/book/style.module.less';
import c from 'classnames';

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
    <div className="col-start-2 col-end-8 flex">
      <div className={s.navigationPanel}>
        <Typography.H1 size="sm" className={c('text-gray-900', s.bookTitle)}>
          {book.title}
        </Typography.H1>
        {book.chapters.map((chapter) => (
          <>
            <Typography.H2 className="text-gray-700 pt-6 !text-base mb-0.5">
              {formatChapterTitle(chapter)}
            </Typography.H2>

            <div className="text-gray-700 text-sm	mb-2">
              {videoCountLabel(chapter)}
            </div>

            {chapter.sections.map((section) => (
              <Typography.H3
                className="text-gray-700 !text-sm py-2"
                weight="regular"
              >
                {formatSectionTitle(chapter, section)}
              </Typography.H3>
            ))}
          </>
        ))}
      </div>
      <div className="-mt-6 border-r border-gray-400" />
    </div>
  );
};
