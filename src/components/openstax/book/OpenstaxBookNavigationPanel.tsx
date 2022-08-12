import { Typography } from '@boclips-ui/typography';
import React from 'react';
import s from 'src/components/openstax/book/style.module.less';
import Button from '@boclips-ui/button';
import CloseButtonIcon from 'src/resources/icons/cross-icon.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import c from 'classnames';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { HashLink } from 'react-router-hash-link';

interface Props {
  book: OpenstaxBook;
  onClose: () => void;
}

export const OpenstaxBookNavigationPanel = ({ book, onClose }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';
  const isMobile = breakpoint.type === 'mobile';

  const renderSectionLevelLabel = (label: string, sectionId: string) => (
    <Typography.H3 className="text-gray-700 !text-sm py-2" weight="regular">
      <HashLink
        onClick={onClose}
        to={{
          pathname: `/explore/openstax/${book.id}`,
          hash: sectionId,
        }}
      >
        {label}
      </HashLink>
    </Typography.H3>
  );

  return (
    <>
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
                <HashLink
                  onClick={onClose}
                  to={{
                    pathname: `/explore/openstax/${book.id}`,
                    hash: `#chapter-${chapter.number}`,
                  }}
                >
                  {chapter.displayLabel}
                </HashLink>
              </Typography.H2>

              <div className="text-gray-700 text-sm	mb-2">
                {getVideoCountLabel(chapter.videoCount)}
              </div>
              {chapter.videoIds?.length > 0 &&
                renderSectionLevelLabel(
                  'Chapter overview',
                  `#chapter-${chapter.number}`,
                )}
              {chapter.sections.map((section) =>
                renderSectionLevelLabel(
                  section.displayLabel,
                  `#section-${chapter.number}-${section.number}`,
                ),
              )}
            </>
          ))}
        </div>
      </nav>
    </>
  );
};
