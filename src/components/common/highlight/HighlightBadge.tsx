import HighlightIcon from 'src/resources/icons/highlights.svg';
import React from 'react';
import s from './style.module.less';

export const HighlightBadge = () => {
  return (
    <div className={s.highlightBadge}>
      <div className={s.icon}>
        <HighlightIcon />
      </div>
      Highlight
    </div>
  );
};
