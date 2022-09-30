import React, { useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Typography } from '@boclips-ui/typography';
import ChevronDownIcon from 'src/resources/icons/chevron-down.svg';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { HashLink } from 'react-router-hash-link';

import c from 'classnames';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { useLocation } from 'react-router-dom';
import {
  chapterOverviewInfo,
  discussionPromptInfo,
  firstChapterElementInfo,
  sectionInfo,
  selectedChapterNumber,
} from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const NavigationPanelBody = ({ book }: Props) => {
  const location = useLocation();
  const [currentSectionLink, setCurrentSectionLink] =
    useState<string>('chapter-1');

  const isSelectedSection = (sectionLink: string) =>
    currentSectionLink === sectionLink;

  const [expandedChapters, setExpandedChapters] = useState(['chapter-1']);

  const { setIsOpen } = useOpenstaxMobileMenu();

  useEffect(() => {
    const newSectionLink = location.hash.replace('#', '');

    updateTableOfContent(newSectionLink);

    if (linksOnlyToChapter(newSectionLink)) {
      setCurrentSectionLink(firstChapterElementInfo(book, newSectionLink).id);
    } else {
      setCurrentSectionLink(newSectionLink);
    }
  }, [location.hash]);

  const renderSectionLevelLabel = (label: string, sectionLink: string) => (
    <HashLink
      key={sectionLink}
      className={s.sectionAnchor}
      onClick={() => {
        setIsOpen(false);
      }}
      scroll={() => {
        window.scrollTo({ top: 0 });
      }}
      to={{
        pathname: `/explore/openstax/${book.id}`,
        hash: sectionLink,
      }}
    >
      <Typography.H3
        className={c(s.courseTitle, {
          [s.selectedSection]: isSelectedSection(sectionLink),
        })}
      >
        <span>{label}</span>
      </Typography.H3>
    </HashLink>
  );

  const updateTableOfContent = (newSelection: string) => {
    const chapterNumber = selectedChapterNumber(newSelection);
    const chapterToExpand = `chapter-${chapterNumber}`;

    setExpandedChapters([chapterToExpand]);
    handleScrollInTableOfContent(chapterNumber);
  };

  const handleScrollInTableOfContent = (chapterNumber: number) => {
    const nav = document.getElementById('chapter-nav');

    const height = [];

    for (let i = 1; i < chapterNumber; i++) {
      const scroll = document.getElementById(
        `chapter-${i + 1}-nav`,
      )?.offsetHeight;

      height.push(scroll);
    }

    nav.scrollTo(
      0,
      height.reduce((acc, i) => acc + i, 0),
    );
  };

  const linksOnlyToChapter = (newSectionLink) =>
    newSectionLink.split('-').length <= 2;

  return (
    <nav
      className={s.tocContent}
      aria-label={`Table of contents of ${book.title}`}
      id="chapter-nav"
    >
      <Accordion.Root
        type="multiple"
        value={expandedChapters}
        onValueChange={setExpandedChapters}
      >
        {book.chapters.map((chapter) => (
          <Accordion.Item
            value={`chapter-${chapter.number}`}
            key={`chapter-${chapter.number}`}
            className="pl-2 mt-2"
          >
            <Accordion.Header
              className="pt-4"
              asChild
              aria-label={chapter.displayLabel}
              id={`chapter-${chapter.number}-nav`}
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
                    className="md:w-6 lg:w-auto lg:relative lg:right-8"
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
                  chapterOverviewInfo(chapter).id,
                )}
              {chapter.discussionPrompt &&
                renderSectionLevelLabel(
                  chapter.discussionPrompt.displayLabel,
                  discussionPromptInfo(chapter).id,
                )}
              {chapter.sections.map((section) =>
                renderSectionLevelLabel(
                  section.displayLabel,
                  sectionInfo(chapter, section).id,
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
