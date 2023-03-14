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
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

const NavigationPanelBody = ({ book }: Props) => {
  const location = useLocation();
  const provider = useAlignmentProvider();
  const [currentSectionLink, setCurrentSectionLink] =
    useState<string>('chapter-0');

  const isSelectedSection = (sectionLink: string) =>
    currentSectionLink === sectionLink;

  const [expandedChapters, setExpandedChapters] = useState(['chapter-0']);

  const { setIsOpen } = useOpenstaxMobileMenu();

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
        pathname: `/explore/${provider.navigationPath}/${book.id}`,
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
    const chapterIndex = getSelectedChapter(book, newSelection)?.index;
    const chapterToExpand = `chapter-${chapterIndex}`;

    setExpandedChapters([chapterToExpand]);
    handleScrollInTableOfContent(chapterIndex);
  };

  const handleScrollInTableOfContent = (chapterIndex: number) => {
    const nav = document.getElementById('chapter-nav');

    const height = [];

    for (let i = 1; i < chapterIndex; i++) {
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
            value={`chapter-${chapter.index}`}
            key={`chapter-${chapter.index}`}
            className={s.tocItemWrapper}
          >
            <Accordion.Header
              className="pt-4"
              asChild
              aria-label={chapter.title}
              id={`chapter-${chapter.index}-nav`}
            >
              <Accordion.Trigger
                aria-label={chapter.title}
                className={s.accordionTrigger}
              >
                <Typography.H2 size="xs" className={s.tocItem}>
                  <span className={s.label}>{chapter.title}</span>
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
                  chapter.chapterOverview.title,
                  chapterOverviewInfo(chapter).id,
                )}
              {chapter.discussionPrompt &&
                renderSectionLevelLabel(
                  chapter.discussionPrompt.title,
                  discussionPromptInfo(chapter).id,
                )}
              {chapter.sections.map((section) =>
                renderSectionLevelLabel(
                  section.title,
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
