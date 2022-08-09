import ArrowIconSVG from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useHistory } from 'react-router-dom';
import c from 'classnames';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import s from './bookCard.module.less';

interface Props {
  book: OpenstaxBook;
}
export const BookCard = ({ book }: Props) => {
  const history = useHistory();

  const onCardClick = (bookId) =>
    history.push({
      pathname: `/explore/openstax/${bookId}`,
    });
  return (
    <button
      onClick={() => onCardClick(book.id)}
      type="button"
      aria-label={`book ${book.title}`}
      className={c(
        s.card,
        'bg-white h-32 flex justify-between border-1 border-blue-100 rounded py-auto shadow-lg',
      )}
    >
      <div className="flex flex-col justify-center items-start h-full ml-5">
        <Typography.H2 size="sm" className="font-medium">
          {book.title}
        </Typography.H2>
        <span className="text-gray-700">
          {getVideoCountLabel(book.videoCount)}
        </span>
      </div>
      <span className="flex flex-col justify-center h-full">
        <div className="bg-blue-100 rounded-full h-16 w-16 mr-8 px-7 py-6">
          <ArrowIconSVG className={s.arrowIcon} />
        </div>
      </span>
    </button>
  );
};
