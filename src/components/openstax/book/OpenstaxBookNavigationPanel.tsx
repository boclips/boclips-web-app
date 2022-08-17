import { Typography } from '@boclips-ui/typography';
import React, { useState } from 'react';
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
  const [selectedSection, setSelectedSection] = useState<string>('');

  const handleSectionClick = (sectionLabel: string) => {
    setSelectedSection(sectionLabel);
    onClose();
  };

  const isSelected = (sectionId: string) => selectedSection === sectionId;

  const renderSectionLevelLabel = (label: string, sectionId: string) => (
    <HashLink
      className={s.sectionAnchor}
      onClick={() => handleSectionClick(sectionId)}
      to={{
        pathname: `/explore/openstax/${book.id}`,
        hash: sectionId,
      }}
    >
      <Typography.H3
        className={c(s.courseTitle, {
          [s.selectedSection]: isSelected(sectionId),
        })}
      >
        <span>{label}</span>
      </Typography.H3>
    </HashLink>
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
              <Typography.H2 className="text-gray-700 pt-6 !text-base mb-0.5 pr-6">
                {chapter.displayLabel}
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
