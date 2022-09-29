import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { HashLink } from 'react-router-hash-link';
import Arrow from 'src/resources/icons/chevron-down.svg';
import {
  getNextChapterElementInfo,
  getNextChapterId,
  getPreviousChapterElementInfo,
  getPreviousChapterId,
} from 'src/components/openstax/helpers/openstaxNavigationHelpers';
import { OpenstaxBook } from 'src/types/OpenstaxBook';

interface Props {
  bookId: string;
  hash: string;
  label: string;
  direction: 'next' | 'previous';
}

const PaginationButton = ({ bookId, hash, label, direction }: Props) => {
  return (
    <div className={direction === 'next' ? 'ml-auto' : 'flex-0'}>
      <HashLink
        scroll={() => {}}
        to={{
          pathname: `/explore/openstax/${bookId}`,
          hash,
        }}
      >
        <Typography.Link
          type="inline-blue"
          className="font-medium inline-flex items-center"
        >
          {direction === 'next' ? (
            <NextLink label={label} />
          ) : (
            <PreviousLink label={label} />
          )}
        </Typography.Link>
      </HashLink>
    </div>
  );
};

interface LinkProps {
  label: string;
}

const NextLink = ({ label }: LinkProps) => {
  return (
    <>
      {label}
      <Arrow className="ml-4 rotate-[270deg]" />
    </>
  );
};

const PreviousLink = ({ label }: LinkProps) => {
  return (
    <>
      <Arrow className="mr-4 rotate-90" />
      {label}
    </>
  );
};

interface ButtonProps {
  book: OpenstaxBook;
  hash: string;
}

export const PreviousSectionButton = ({ book, hash }: ButtonProps) => {
  return (
    <PaginationButton
      bookId={book.id}
      hash={getPreviousChapterElementInfo(book, hash).id}
      label="Previous section"
      direction="previous"
    />
  );
};

export const PreviousChapterButton = ({ book, hash }: ButtonProps) => {
  return (
    <PaginationButton
      bookId={book.id}
      hash={getPreviousChapterId(book, hash)}
      label="Previous chapter"
      direction="previous"
    />
  );
};

export const NextSectionButton = ({ book, hash }: ButtonProps) => {
  return (
    <PaginationButton
      bookId={book.id}
      hash={getNextChapterElementInfo(book, hash).id}
      label="Next section"
      direction="next"
    />
  );
};

export const NextChapterButton = ({ book, hash }: ButtonProps) => {
  return (
    <PaginationButton
      bookId={book.id}
      hash={getNextChapterId(book, hash)}
      label="Next chapter"
      direction="next"
    />
  );
};
