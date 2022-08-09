import { Typography } from '@boclips-ui/typography';
import React from 'react';
import s from 'src/components/openstax/book/style.module.less';
import Button from '@boclips-ui/button';
import CloseButtonIcon from 'src/resources/icons/cross-icon.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import c from 'classnames';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';

interface Props {
  book: OpenstaxBook;
  onClose: () => void;
}

export const OpenstaxBookNavigationPanel = ({ book, onClose }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';
  const isMobile = breakpoint.type === 'mobile';

  return (
    <div className={c('col-start-2 col-end-8', isNotDesktop ? s.overlay : '')}>
      <div className={c('flex', s.tocHeader)}>
        {isNotDesktop && <span />}
        <Typography.H1 size="sm" className="text-gray-900">
          {book.title}
        </Typography.H1>
        {isNotDesktop && (
          <Button
            onClick={onClose}
            text="Close"
            type="label"
            iconOnly={isMobile}
            icon={<CloseButtonIcon />}
            aria-label="Close the Table of contents"
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
                {chapter.displayLabel}
              </Typography.H2>

              <div className="text-gray-700 text-sm	mb-2">
                {getVideoCountLabel(chapter.videoCount)}
              </div>

              {chapter.sections.map((section) => (
                <Typography.H3
                  className="text-gray-700 !text-sm py-2"
                  weight="regular"
                >
                  {section.displayLabel}
                </Typography.H3>
              ))}
            </>
          ))}
        </div>
      </nav>
    </div>
  );
};
