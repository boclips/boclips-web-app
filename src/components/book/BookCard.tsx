import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import ArrowIconSVG from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { useHistory } from 'react-router-dom';
import s from './style.module.less';

interface Props {
  book: Book;
}
export const BookCard = ({ book }: Props) => {
  const history = useHistory();

  const onCardClick = (bookId) =>
    history.push({
      pathname: `/openstax/${bookId}`,
    });
  return (
    <button
      onClick={() => onCardClick(book.id)}
      type="button"
      aria-label={`book ${book.title}`}
      className="bg-white h-32 flex justify-between border-1 border-blue-100 rounded py-auto shadow-lg"
    >
      <div className="flex flex-col justify-center h-full ml-5">
        <Typography.H2 size="sm" className="font-medium">
          {book.title}
        </Typography.H2>
      </div>
      <span className="flex flex-col justify-center h-full">
        <div className="bg-blue-100 rounded-full h-16 w-16 mr-8 px-7 py-6">
          <ArrowIconSVG className={s.arrowIcon} />
        </div>
      </span>
    </button>
  );
};
