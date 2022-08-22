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
import * as Accordion from '@radix-ui/react-accordion';
import ChevronDownIcon from 'src/resources/icons/chevron-down.svg';

interface Props {
  book: OpenstaxBook;
  onClose: () => void;
}

export const OpenstaxBookNavigationPanel = ({ book, onClose }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';
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
        <Typography.H1 size="sm" className="text-gray-900">
          {book.title}
        </Typography.H1>
        {isNotDesktop && (
          <Button
            onClick={onClose}
            text="Close"
            type="label"
            iconOnly
            icon={<CloseButtonIcon />}
            aria-label="Close the Table of contents"
            className={s.closeButton}
          />
        )}
      </div>
      <nav
        className={s.tocContent}
        aria-label={`Table of contents of ${book.title}`}
      >
        <Accordion.Root
          className={s.navigationPanel}
          type="multiple"
          defaultValue={['chapter-1']}
        >
          {book.chapters.map((chapter) => (
            <Accordion.Item value={`chapter-${chapter.number}`}>
              <Accordion.Header
                className="pt-4"
                asChild
                aria-label={chapter.displayLabel}
              >
                <Accordion.Trigger
                  aria-label={chapter.displayLabel}
                  className="w-full flex flex-col"
                >
                  <Typography.H2
                    size="xs"
                    className="!text-base w-full font-medium flex justify-between items-center text-left text-gray-700"
                  >
                    {chapter.displayLabel}
                    <ChevronDownIcon
                      aria-hidden
                      className={c(s.chevronIcon, 'w-6')}
                    />
                  </Typography.H2>
                  <div className="text-gray-700 text-sm">
                    {getVideoCountLabel(chapter.videoCount)}
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
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
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </nav>
    </>
  );
};
