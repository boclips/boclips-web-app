import React, { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Typography } from '@boclips-ui/typography';
import ChevronDownIcon from 'src/resources/icons/chevron-down.svg';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { HashLink } from 'react-router-hash-link';

import c from 'classnames';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useLocation } from 'react-router-dom';
import { selectedChapterNumber } from 'src/components/openstax/helpers/helpers';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const NavigationPanelBody = ({ book }: Props) => {
  const currentBreakpoint = useMediaBreakPoint();
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const isSelected = (sectionId: string) => selectedSection === sectionId;

  const [expandedChapters, setExpandedChapters] = useState(['chapter-1']);

  const { setIsOpen } = useOpenstaxMobileMenu();

  useEffect(() => {
    const navigationLabel = location.hash.replace('#', '');
    const element = document.getElementById(navigationLabel);
    if (element !== null && !isSelected(navigationLabel)) {
      handleSectionClick(location.hash);
      scrollWithNavbarOffset(element);
    }
    navigateTableOfContent();
  }, [location.hash]);

  const scrollWithNavbarOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
    const navbarOffset = currentBreakpoint.type === 'desktop' ? -74 : -121;
    const padding = -16;
    window.scrollTo({
      top: yCoordinate + navbarOffset + padding,
      behavior: 'smooth',
    });
  };

  const renderSectionLevelLabel = (label: string, navigationLink: string) => (
    <HashLink
      key={navigationLink}
      className={s.sectionAnchor}
      onClick={() => {
        handleSectionClick(navigationLink);
        setIsOpen(false);
      }}
      scroll={scrollWithNavbarOffset}
      to={{
        pathname: `/explore/openstax/${book.id}`,
        hash: navigationLink,
      }}
    >
      <Typography.H3
        className={c(s.courseTitle, {
          [s.selectedSection]: isSelected(navigationLink),
        })}
      >
        <span>{label}</span>
      </Typography.H3>
    </HashLink>
  );

  const handleSectionClick = (navigationLabel: string) => {
    const chapterNumber = Number(navigationLabel.split('-')[1]);
    if (chapterNumber !== selectedChapterNumber(location)) {
      window.scrollTo({ top: 0 });
    }

    setSelectedSection(navigationLabel);
  };

  const navigateTableOfContent = () => {
    const chapterToExpand = `chapter-${selectedChapterNumber(location)}`;

    if (!expandedChapters.includes(chapterToExpand)) {
      setExpandedChapters([chapterToExpand, ...expandedChapters]);
    }
  };

  return (
    <nav
      className={s.tocContent}
      aria-label={`Table of contents of ${book.title}`}
    >
      <Accordion.Root
        type="multiple"
        value={expandedChapters}
        onValueChange={setExpandedChapters}
      >
        {book.chapters.map((chapter) => (
          <Accordion.Item
            id={`chapter-${chapter.number}-nav`}
            value={`chapter-${chapter.number}`}
            key={`chapter-${chapter.number}`}
          >
            <Accordion.Header
              className="pt-4"
              asChild
              aria-label={chapter.displayLabel}
            >
              <Accordion.Trigger
                aria-label={chapter.displayLabel}
                className={c('w-full', s.accordionTrigger)}
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
              {chapter.chapterOverview &&
                renderSectionLevelLabel(
                  chapter.chapterOverview.displayLabel,
                  `#chapter-${chapter.number}`,
                )}
              {chapter.discussionPrompt &&
                renderSectionLevelLabel(
                  chapter.discussionPrompt.displayLabel,
                  `#chapter-${chapter.number}-discussion-prompt`,
                )}
              {chapter.sections.map((section) =>
                renderSectionLevelLabel(
                  section.displayLabel,
                  `#chapter-${chapter.number}-section-${section.number}`,
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
