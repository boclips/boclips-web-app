import React from 'react';
import {
  getAllTargetsInTopic,
  getSelectedTarget,
  getSelectedTopic,
} from '@components/alignments/themePage/helpers/themeNavigationHelpers';
import { useLocation } from 'react-router-dom';
import {
  NextTopicButton,
  NextTargetButton,
  PreviousTopicButton,
  PreviousSectionButton,
} from '@components/alignments/themePage/theme/pagination/PaginationButton';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import s from './style.module.less';

interface Props {
  theme: Theme;
}

const PaginationPanel = ({ theme }: Props) => {
  const location = useLocation();
  const currentTarget = getSelectedTarget(theme, location.hash);
  const currentTopic = getSelectedTopic(theme, location.hash);
  const allTargetsInTopic = getAllTargetsInTopic(currentTopic);

  function first<T>(array: T[]): T {
    return array[0];
  }

  function last<T>(array: T[]): T {
    return array[array.length - 1];
  }

  const showNextTopicButton = () =>
    !showNextTargetButton() && currentTopic?.index < last(theme.topics).index;

  const showPrevTopicButton = () =>
    !showPrevTargetButton() && currentTopic?.index > first(theme.topics).index;

  const showNextTargetButton = () =>
    allTargetsInTopic.length && currentTarget.id !== last(allTargetsInTopic).id;

  const showPrevTargetButton = () =>
    allTargetsInTopic.length &&
    currentTarget.id !== first(allTargetsInTopic).id;

  return (
    <div className={s.paginationPanel}>
      {showPrevTargetButton() && (
        <PreviousSectionButton theme={theme} hash={location.hash} />
      )}

      {showPrevTopicButton() && (
        <PreviousTopicButton theme={theme} hash={location.hash} />
      )}

      {showNextTargetButton() && (
        <NextTargetButton theme={theme} hash={location.hash} />
      )}

      {showNextTopicButton() && (
        <NextTopicButton theme={theme} hash={location.hash} />
      )}
    </div>
  );
};

export default PaginationPanel;
