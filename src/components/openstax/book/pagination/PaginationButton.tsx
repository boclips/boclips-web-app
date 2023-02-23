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
} from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { PaginationLink } from 'src/components/openstax/book/pagination/PaginationLink';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  bookId: string;
  hash: string;
  secondaryLabel: string;
  primaryLabel: string;
  direction: 'next' | 'previous';
}

const PaginationButton = ({
  bookId,
  hash,
  secondaryLabel,
  primaryLabel,
  direction,
}: Props) => {
  const next = direction === 'next';

  if (next) {
    return (
      <PaginationLink bookId={bookId} hash={hash}>
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
    <PaginationLink bookId={bookId} hash={hash}>
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
  book: OpenstaxBook;
  hash: string;
}

export const PreviousSectionButton = ({ book, hash }: ButtonProps) => {
  const element = getPreviousChapterElementInfo(book, hash);

  return (
    <PaginationButton
      bookId={book.id}
      hash={element.id}
      secondaryLabel="Previous section"
      primaryLabel={element.title}
      direction="previous"
    />
  );
};

export const PreviousChapterButton = ({ book, hash }: ButtonProps) => {
  const previousChapterHash = getPreviousChapterId(book, hash);
  const chapter = getSelectedChapter(book, previousChapterHash);
  const element = getSelectedChapterElement(book, previousChapterHash);

  return (
    <PaginationButton
      bookId={book.id}
      hash={element.id}
      secondaryLabel="Previous chapter"
      primaryLabel={chapter.title}
      direction="previous"
    />
  );
};

export const NextSectionButton = ({ book, hash }: ButtonProps) => {
  const element = getNextChapterElementInfo(book, hash);

  return (
    <PaginationButton
      bookId={book.id}
      hash={element.id}
      secondaryLabel="Next section"
      primaryLabel={element.title}
      direction="next"
    />
  );
};

export const NextChapterButton = ({ book, hash }: ButtonProps) => {
  const nextChapterHash = getNextChapterId(book, hash);
  const chapter = getSelectedChapter(book, nextChapterHash);
  const element = getSelectedChapterElement(book, nextChapterHash);

  return (
    <PaginationButton
      bookId={book.id}
      hash={element.id}
      secondaryLabel="Next chapter"
      primaryLabel={chapter.title}
      direction="next"
    />
  );
};
