import React, { useEffect, useState } from 'react';
import { Header } from 'src/components/explore/theme/Header';
import { useLocation } from 'react-router-dom';
import {
  getSelectedTarget,
  getSelectedTopic,
} from 'src/components/explore/helpers/themeNavigationHelpers';
import {
  TargetDetails,
  TargetInfo,
} from 'src/components/explore/theme/TargetDetails';
import {
  Theme,
  Topic,
} from 'boclips-api-client/dist/sub-clients/alignments/model/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

export const Content = ({ theme }: Props) => {
  const location = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<Topic>(
    getSelectedTopic(theme, 'topic-0'),
  );

  const [selectedTarget, setSelectedTarget] = useState<TargetInfo>({
    title: '',
    id: '',
    videos: [],
  });

  useEffect(() => {
    const newTargetLink = location.hash.replace('#', '');
    setSelectedTopic(getSelectedTopic(theme, newTargetLink));
    setSelectedTarget(getSelectedTarget(theme, newTargetLink));

    window.scrollTo({ top: 0 });
  }, [location.hash]);

  return (
    <main
      aria-label={`Content for ${theme.title}`}
      tabIndex={-1}
      className={s.main}
    >
      <Header themeTitle={theme.title} topicTitle={selectedTopic.title} />
      <TargetDetails data={selectedTarget} />
    </main>
  );
};
