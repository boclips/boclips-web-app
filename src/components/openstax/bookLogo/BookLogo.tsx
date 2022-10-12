import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
  className?: string;
}

export const BookLogo = ({ book, className }: Props) => (
  <div className={c(s.img, className)}>
    {book.logoUrl.length > 0 ? (
      <img src={book.logoUrl} alt={`${book.title} cover`} />
    ) : (
      <img
        src="https://assets.boclips.com/boclips-public-static-files/boclips/openstax/OSX-ALLY-Blue-RGB-150dpi.png"
        alt={`${book.title} generic cover`}
      />
    )}
  </div>
);
