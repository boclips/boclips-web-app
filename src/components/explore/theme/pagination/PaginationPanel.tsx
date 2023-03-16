import React from 'react';
import {
  getAllSectionsInChapter,
  getSelectedChapter,
  getSelectedChapterElement,
} from 'src/components/explore/helpers/openstaxNavigationHelpers';
import { useLocation } from 'react-router-dom';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import {
  NextChapterButton,
  NextSectionButton,
  PreviousChapterButton,
  PreviousSectionButton,
} from 'src/components/explore/theme/pagination/PaginationButton';
import s from './style.module.less';

interface Props {
  theme: OpenstaxBook;
}

const PaginationPanel = ({ theme }: Props) => {
  const location = useLocation();
  const currentSection = getSelectedChapterElement(theme, location.hash);
  const currentChapter = getSelectedChapter(theme, location.hash);
  const allSectionsInChapter = getAllSectionsInChapter(currentChapter);

  function first<T>(array: T[]): T {
    return array[0];
  }

  function last<T>(array: T[]): T {
    return array[array.length - 1];
  }

  const showNextChapterButton = () =>
    !showNextSectionButton() &&
    currentChapter?.index < last(theme.topics).index;

  const showPrevChapterButton = () =>
    !showPrevSectionButton() &&
    currentChapter?.index > first(theme.topics).index;

  const showNextSectionButton = () =>
    allSectionsInChapter.length &&
    currentSection.id !== last(allSectionsInChapter).id;

  const showPrevSectionButton = () =>
    allSectionsInChapter.length &&
    currentSection.id !== first(allSectionsInChapter).id;

  return (
    <div className={s.paginationPanel}>
      {showPrevSectionButton() && (
        <PreviousSectionButton theme={theme} hash={location.hash} />
      )}

      {showPrevChapterButton() && (
        <PreviousChapterButton theme={theme} hash={location.hash} />
      )}

      {showNextSectionButton() && (
        <NextSectionButton theme={theme} hash={location.hash} />
      )}

      {showNextChapterButton() && (
        <NextChapterButton theme={theme} hash={location.hash} />
      )}
    </div>
  );
};

export default PaginationPanel;
