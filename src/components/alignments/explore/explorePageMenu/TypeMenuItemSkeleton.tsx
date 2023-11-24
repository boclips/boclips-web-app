import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const TypeMenuItemSkeleton = () => {
  return (
    <div
      className={c(
        s.typeList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      {Array.from(Array(6)).map((_, i: number) => (
        <li
          key={i}
          data-qa={`types-skeleton-${i + 1}`}
          className={c(s.type, s.typeSkeleton)}
        />
      ))}
    </div>
  );
};

export default TypeMenuItemSkeleton;
