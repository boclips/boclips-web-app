import { Typography } from 'boclips-ui';
import React from 'react';
import NextArrow from '@resources/icons/next-section-arrow.svg?react';
import PreviousArrow from '@resources/icons/prev-section-arrow.svg?react';
import {
  getNextTargetInfo,
  getNextTopicId,
  getPreviousTargetInfo,
  getPreviousTopicId,
  getSelectedTarget,
  getSelectedTopic,
} from '@src/components/alignments/themePage/helpers/themeNavigationHelpers';
import { PaginationLink } from '@src/components/alignments/themePage/theme/pagination/PaginationLink';
import c from 'classnames';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import s from './style.module.less';

interface Props {
  themeId: string;
  hash: string;
  secondaryLabel: string;
  primaryLabel: string;
  direction: 'next' | 'previous';
}

const PaginationButton = ({
  themeId,
  hash,
  secondaryLabel,
  primaryLabel,
  direction,
}: Props) => {
  const next = direction === 'next';

  if (next) {
    return (
      <PaginationLink themeId={themeId} hash={hash}>
        <Label
          className={c(s.label, { [s.next]: next })}
          primaryLabel={primaryLabel}
          secondaryLabel={secondaryLabel}
        />
        <div className={s.icon}>
          <NextArrow />
        </div>
      </PaginationLink>
    );
  }

  return (
    <PaginationLink themeId={themeId} hash={hash}>
      <div className={s.icon}>
        <PreviousArrow />
      </div>
      <Label
        className={c(s.label, { [s.prev]: !next })}
        primaryLabel={primaryLabel}
        secondaryLabel={secondaryLabel}
      />
    </PaginationLink>
  );
};

interface LabelsProps {
  primaryLabel: string;
  secondaryLabel: string;
  className?: string;
}

const Label = ({ primaryLabel, secondaryLabel, className }: LabelsProps) => (
  <div className={className}>
    <Typography.Body size="small" className="text-gray-700">
      {secondaryLabel}
    </Typography.Body>
    <Typography.Link>{primaryLabel}</Typography.Link>
  </div>
);

interface ButtonProps {
  theme: Theme;
  hash: string;
}

export const PreviousSectionButton = ({ theme, hash }: ButtonProps) => {
  const element = getPreviousTargetInfo(theme, hash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={element.id}
      secondaryLabel="Previous"
      primaryLabel={element.title}
      direction="previous"
    />
  );
};

export const PreviousTopicButton = ({ theme, hash }: ButtonProps) => {
  const previousTopicHash = getPreviousTopicId(theme, hash);
  const topic = getSelectedTopic(theme, previousTopicHash);
  const target = getSelectedTarget(theme, previousTopicHash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={target.id}
      secondaryLabel="Previous"
      primaryLabel={topic.title}
      direction="previous"
    />
  );
};

export const NextTargetButton = ({ theme, hash }: ButtonProps) => {
  const target = getNextTargetInfo(theme, hash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={target.id}
      secondaryLabel="Next"
      primaryLabel={target.title}
      direction="next"
    />
  );
};

export const NextTopicButton = ({ theme, hash }: ButtonProps) => {
  const nextTopicHash = getNextTopicId(theme, hash);
  const topic = getSelectedTopic(theme, nextTopicHash);
  const target = getSelectedTarget(theme, nextTopicHash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={target.id}
      secondaryLabel="Next"
      primaryLabel={topic.title}
      direction="next"
    />
  );
};
