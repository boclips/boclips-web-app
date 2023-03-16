import React, { useEffect, useState } from 'react';
import { OpenstaxBook, OpenstaxChapter } from 'src/types/OpenstaxBook';
import { Header } from 'src/components/explore/theme/Header';
import { useLocation } from 'react-router-dom';
import {
  getSelectedChapter,
  getSelectedChapterElement,
} from 'src/components/explore/helpers/openstaxNavigationHelpers';
import {
  TargetElement,
  TargetInfo,
} from 'src/components/explore/theme/TargetElement';
import s from './style.module.less';

interface Props {
  theme: OpenstaxBook;
}

export const Content = ({ theme }: Props) => {
  const location = useLocation();
  const [selectedChapter, setSelectedChapter] = useState<OpenstaxChapter>(
    getSelectedChapter(theme, 'chapter-0'),
  );

  const [selectedChapterElement, setSelectedChapterElement] =
    useState<TargetInfo>({
      title: '',
      id: '',
      videos: [],
    });

  useEffect(() => {
    const newTargetLink = location.hash.replace('#', '');
    setSelectedChapter(getSelectedChapter(theme, newTargetLink));
    setSelectedChapterElement(getSelectedChapterElement(theme, newTargetLink));

    window.scrollTo({ top: 0 });
  }, [location.hash]);

  return (
    <main
      aria-label={`Content for ${theme.title}`}
      tabIndex={-1}
      className={s.main}
    >
      <Header themeTitle={theme.title} topicTitle={selectedChapter.title} />
      <TargetElement target={selectedChapterElement} />
    </main>
  );
};
