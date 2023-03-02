import ArrowIconSVG from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useNavigate } from 'react-router-dom';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { BookLogo } from 'src/components/openstax/bookLogo/BookLogo';
import { handleEscapeKeyEvent } from 'src/services/handleKeyEvent';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
}

export const BookCard = ({ book }: Props) => {
  const navigate = useNavigate();
  const provider = useAlignmentProvider();
  const onKeyDown = () => {
    document.querySelector('main').focus();
  };

  const onCardClick = (bookId) =>
    navigate({
      pathname: `/explore/${provider.navigationPath}/${bookId}`,
    });

  return (
    <button
      onClick={() => onCardClick(book.id)}
      type="button"
      aria-label={`book ${book.title}`}
      className={s.bookCard}
      onKeyDown={(e) => handleEscapeKeyEvent(e, onKeyDown)}
    >
      <BookLogo book={book} />
      <div className={s.bookTitle}>
        <Typography.H2 size="xs" className="!text-base truncate">
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
