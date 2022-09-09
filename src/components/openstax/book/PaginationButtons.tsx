import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { selectedChapterNumber } from 'src/components/openstax/helpers/helpers';
import { useLocation } from 'react-router-dom';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { Typography } from '@boclips-ui/typography';
import Arrow from 'src/resources/icons/chevron-down.svg';

interface Props {
  book: OpenstaxBook;
}

const PaginationButtons = ({ book }: Props) => {
  const location = useLocation();

  const selectedChapterIndex = () =>
    book.chapters.findIndex(
      (chapter) => chapter.number === selectedChapterNumber(location),
    );

  const getFirstChapter = () => book.chapters[0];

  const getLastChapter = () => book.chapters[book.chapters.length - 1];

  const showNextChapterButton = () =>
    selectedChapterNumber(location) < getLastChapter().number;

  const showPrevChapterButton = () =>
    selectedChapterNumber(location) > getFirstChapter().number;

  return (
    <div className="flex">
      {showPrevChapterButton() && (
        <div className="flex-0">
          <HashLink
            scroll={() => {}}
            to={{
              pathname: `/explore/openstax/${book.id}`,
              hash: `chapter-${
                book.chapters[selectedChapterIndex() - 1].number
              }`,
            }}
          >
            <Typography.Link
              type="inline-blue"
              className="font-medium inline-flex items-center"
            >
              <Arrow className="mr-4 rotate-90" />
              Previous Chapter
            </Typography.Link>
          </HashLink>
        </div>
      )}

      {showNextChapterButton() && (
        <div className="ml-auto">
          <HashLink
            scroll={() => {}}
            to={{
              pathname: `/explore/openstax/${book.id}`,
              hash: `chapter-${
                book.chapters[selectedChapterIndex() + 1].number
              }`,
            }}
          >
            <Typography.Link
              type="inline-blue"
              className="font-medium inline-flex items-center"
            >
              Next Chapter
              <Arrow className="ml-4 rotate-[270deg]" />
            </Typography.Link>
          </HashLink>
        </div>
      )}
    </div>
  );
};

export default PaginationButtons;
