import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import ArrowIconSVG from 'resources/icons/arrow-no-size.svg';
import React from 'react';
import { Typography } from '@boclips-ui/typography';

interface Props {
  book: Book;
}
export const BookCard = ({ book }: Props) => {
  const onCardClick = (id) => console.log(id);
  return (
    <button
      onClick={() => onCardClick(book.id)}
      type="button"
      className="bg-white h-32 w-1/2 flex justify-between border-1 border-blue-100 rounded py-auto shadow-lg col-span-8 mt-8"
    >
      <div className="flex flex-col justify-center h-full ml-5">
        <Typography.H2 size="sm" className="font-medium">
          {book.title}
        </Typography.H2>
      </div>
      <span className="flex flex-col justify-center h-full">
        <div className="bg-blue-100 rounded-full h-16 w-16 mr-8 px-7 py-6">
          <ArrowIconSVG />
        </div>
      </span>
    </button>
  );
};
