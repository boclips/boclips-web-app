import { Typography } from '@boclips-ui/typography';
import React from 'react';
import NextArrow from 'src/resources/icons/next-section-arrow.svg';
import PreviousArrow from 'src/resources/icons/prev-section-arrow.svg';
import {
  getNextChapterElementInfo,
  getNextChapterId,
  getPreviousChapterElementInfo,
  getPreviousChapterId,
  getSelectedChapter,
  getSelectedChapterElement,
} from 'src/components/explore/helpers/openstaxNavigationHelpers';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { PaginationLink } from 'src/components/explore/theme/pagination/PaginationLink';
import c from 'classnames';
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
    <Typography.Link className={s.sectionTitle}>{primaryLabel}</Typography.Link>
  </div>
);

interface ButtonProps {
  theme: OpenstaxBook;
  hash: string;
}

export const PreviousSectionButton = ({ theme, hash }: ButtonProps) => {
  const element = getPreviousChapterElementInfo(theme, hash);

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

export const PreviousChapterButton = ({ theme, hash }: ButtonProps) => {
  const previousChapterHash = getPreviousChapterId(theme, hash);
  const chapter = getSelectedChapter(theme, previousChapterHash);
  const element = getSelectedChapterElement(theme, previousChapterHash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={element.id}
      secondaryLabel="Previous"
      primaryLabel={chapter.title}
      direction="previous"
    />
  );
};

export const NextSectionButton = ({ theme, hash }: ButtonProps) => {
  const element = getNextChapterElementInfo(theme, hash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={element.id}
      secondaryLabel="Next"
      primaryLabel={element.title}
      direction="next"
    />
  );
};

export const NextChapterButton = ({ theme, hash }: ButtonProps) => {
  const nextChapterHash = getNextChapterId(theme, hash);
  const chapter = getSelectedChapter(theme, nextChapterHash);
  const element = getSelectedChapterElement(theme, nextChapterHash);

  return (
    <PaginationButton
      themeId={theme.id}
      hash={element.id}
      secondaryLabel="Next"
      primaryLabel={chapter.title}
      direction="next"
    />
  );
};
