import { Typography } from '@boclips-ui/typography';
import React from 'react';
import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import s from 'src/components/openstax/book/style.module.less';
import Button from '@boclips-ui/button';
import CloseButtonIcon from 'src/resources/icons/cross-icon.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import c from 'classnames';

interface Props {
  book: Book;
  onClose: () => void;
}

export const OpenstaxBookNavigationPanel = ({ book, onClose }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';
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
    <div className={c('col-start-2 col-end-8', isNotDesktop ? s.overlay : '')}>
      <div className={c('flex', s.tocHeader)}>
        <Typography.H1 size="sm" className="text-gray-900 grow">
          {book.title}
        </Typography.H1>
        {isNotDesktop && (
          <Button
            onClick={onClose}
            text="Close"
            type="label"
            icon={<CloseButtonIcon />}
          />
        )}
      </div>
      <nav
        className={s.tocContent}
        aria-label={`Table of contents of ${book.title}`}
      >
        <div className={s.navigationPanel}>
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
      </nav>
    </div>
  );
};
