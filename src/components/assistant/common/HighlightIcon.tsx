import React from 'react';
import HighlightSvg from 'src/resources/icons/highlights.svg';
import s from './style.module.less';

export const HighlightIcon = () => {
  return (
    <div className={s.icon}>
      <HighlightSvg />
    </div>
  );
};
