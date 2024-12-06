import c from 'classnames';
import s from '@components/playlists/comments/style.module.less';
import React from 'react';

const Bubble = ({
  number,
  inline = false,
  ariaLabel = '',
}: {
  number: number;
  inline?: boolean;
  ariaLabel?: string;
}) => {
  return number ? (
    <div aria-label={ariaLabel} className={c(s.bubble, { [s.inline]: inline })}>
      {number}
    </div>
  ) : null;
};

export default Bubble;
