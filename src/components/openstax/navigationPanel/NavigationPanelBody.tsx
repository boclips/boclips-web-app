import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Typography } from '@boclips-ui/typography';
import ChevronDownIcon from 'src/resources/icons/chevron-down.svg';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { HashLink } from 'react-router-hash-link';

import c from 'classnames';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const NavigationPanelBody = ({ book }: Props) => {
  const [selectedSection, setSelectedSection] = useState<string>('');
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

  const handleSectionClick = (sectionLabel: string) => {
    setSelectedSection(sectionLabel);
  };

  return (
    <nav
      className={s.tocContent}
      aria-label={`Table of contents of ${book.title}`}
    >
      <Accordion.Root type="multiple" defaultValue={['chapter-1']}>
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
                  <span className="w-4/5">{chapter.displayLabel}</span>
                  <ChevronDownIcon
                    aria-hidden
                    className={c(
                      s.chevronIcon,
                      'md:w-6 lg:w-auto lg:relative lg:right-8',
                    )}
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
  );
};

export default NavigationPanelBody;
