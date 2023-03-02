import React from 'react';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import c from 'classnames';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

interface Props {
  book: OpenstaxBook;
  className?: string;
}

export const BookLogo = ({ book, className }: Props) => {
  const provider = useAlignmentProvider();

  return (
    <div className={c(s.img, className)}>
      {book.logoUrl.length > 0 ? (
        <img src={book.logoUrl} alt={`${book.title} cover`} />
      ) : (
        <img
          src={provider.themeDefaultLogoUrl}
          alt={`${book.title} generic cover`}
        />
      )}
    </div>
  );
};
