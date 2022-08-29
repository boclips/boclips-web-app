import ArrowIconSVG from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useHistory } from 'react-router-dom';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import s from './style.module.less';

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
      className={s.bookCard}
    >
      <div className={s.img}>
        {book.logoUrl.length > 0 ? (
          <img src={book.logoUrl} alt={`${book.title} cover`} />
        ) : (
          <img
            src="https://placeholder.pics/svg/77x100"
            alt={`${book.title} generic cover`}
          />
        )}
      </div>
      <div className={s.bookTitle}>
        <Typography.H2 size="sm" className="font-medium">
          {book.title}
        </Typography.H2>
        <span className="text-gray-700 text-sm">
          {getVideoCountLabel(book.videoCount)}
        </span>
      </div>
      <div className={s.arrow}>
        <ArrowIconSVG aria-hidden className={s.arrowIcon} />
      </div>
    </button>
  );
};
