import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const BookCardSkeleton = () => {
  return (
    <>
      {Array.from(Array(4)).map((_, i: number) => (
        <li
          key={i}
          data-qa={`book-card-skeleton-${i + 1}`}
          className={c(s.bookCard, s.bookCardSkeleton)}
        />
      ))}
    </>
  );
};

export default BookCardSkeleton;
