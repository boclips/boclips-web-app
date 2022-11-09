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
  getSelectedChapter,
  sectionInfo,
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
  const [openedLastChapter, setOpenedLastChapter] =
    useState<boolean>(undefined);

  const { setIsOpen } = useOpenstaxMobileMenu();
  const lastChapter = `chapter-${book.chapters.length}`;

  useEffect(() => {
    const newSectionLink = location.hash.replace('#', '');

    updateTableOfContent(newSectionLink);

    if (linksOnlyToChapter(newSectionLink)) {
      const firstChapterElement = firstChapterElementInfo(book, newSectionLink);
      if (firstChapterElement !== undefined) {
        setCurrentSectionLink(firstChapterElement.id);
      }
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
        {label}
      </Typography.H3>
    </HashLink>
  );

  const updateTableOfContent = (newSelection: string) => {
    const chapterNumber = getSelectedChapter(book, newSelection)?.number;
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

  useEffect(() => {
    if (openedLastChapter) {
      const lastChapterButton = document.getElementById(`${lastChapter}-nav`);
      const chapterContainer = lastChapterButton.nextElementSibling;
      const nav = document.getElementById('chapter-nav');
      nav.scrollBy(0, chapterContainer.scrollHeight);
    }
  }, [openedLastChapter]);

  const onValueChange = (values: string[]) => {
    const expandedMore = values.length > expandedChapters.length;
    const selectedChapter = values[values.length - 1];

    const expandedLastChapter = expandedMore && selectedChapter === lastChapter;

    setOpenedLastChapter(expandedLastChapter);
    setExpandedChapters(values);
  };

  return (
    <nav
      className={s.tocContent}
      aria-label={`Table of contents of ${book.title}`}
      id="chapter-nav"
    >
      <Accordion.Root
        type="multiple"
        value={expandedChapters}
        onValueChange={onValueChange}
      >
        {book.chapters.map((chapter) => (
          <Accordion.Item
            value={`chapter-${chapter.number}`}
            key={`chapter-${chapter.number}`}
            className={s.tocItemWrapper}
          >
            <Accordion.Header
              className="pt-4"
              asChild
              aria-label={chapter.displayLabel}
              id={`chapter-${chapter.number}-nav`}
            >
              <Accordion.Trigger
                aria-label={chapter.displayLabel}
                className={s.accordionTrigger}
              >
                <Typography.H2 size="xs" className={s.tocItem}>
                  <span className={s.label}>{chapter.displayLabel}</span>
                  <span className={s.icon}>
                    <ChevronDownIcon aria-hidden />
                  </span>
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
