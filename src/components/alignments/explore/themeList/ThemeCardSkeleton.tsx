import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const ThemeCardSkeleton = () => {
  return (
    <div
      className={c(
        s.themeList,
        'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5',
      )}
    >
      {Array.from(Array(4)).map((_, i: number) => (
        <li
          key={i}
          data-qa={`theme-card-skeleton-${i + 1}`}
          className={c(s.themeCard, s.themeCardSkeleton)}
        />
      ))}
    </div>
  );
};

export default ThemeCardSkeleton;
