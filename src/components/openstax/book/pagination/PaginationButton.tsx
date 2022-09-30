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
  if (direction === 'next') {
    return (
      <div className="ml-auto">
        <PaginationLink bookId={bookId} hash={hash}>
          <Labels
            className="flex flex-col mr-8 text-end"
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
          />
          <NextArrow className="self-end mb-1" />
        </PaginationLink>
      </div>
    );
  }
  return (
    <div className="flex-0">
      <PaginationLink bookId={bookId} hash={hash}>
        <PreviousArrow className="self-end mb-1" />
        <Labels
          className="flex flex-col ml-8"
          primaryLabel={primaryLabel}
          secondaryLabel={secondaryLabel}
        />
      </PaginationLink>
    </div>
  );
};

interface LabelsProps {
  primaryLabel: string;
  secondaryLabel: string;
  className?: string;
}
const Labels = ({ primaryLabel, secondaryLabel, className }: LabelsProps) => (
  <div className={className}>
    <Typography.Body className="text-gray-700 !text-sm">
      {secondaryLabel}
    </Typography.Body>
    <Typography.Link
      type="inline-blue"
      className={c('font-medium inline-flex items-center', s.sectionTitle)}
    >
      {primaryLabel}
    </Typography.Link>
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
      primaryLabel={element.displayLabel}
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
      primaryLabel={chapter.displayLabel}
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
      primaryLabel={element.displayLabel}
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
      primaryLabel={chapter.displayLabel}
      direction="next"
    />
  );
};
