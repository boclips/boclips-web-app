import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const TypeMenuItemSkeleton = () => {
  return (
    <>
      {Array.from(Array(6)).map((_, i: number) => (
        <li
          key={i}
          data-qa={`types-skeleton-${i + 1}`}
          className={c(s.type, s.typeSkeleton)}
        />
      ))}
    </>
  );
};

export default TypeMenuItemSkeleton;
