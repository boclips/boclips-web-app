import c from 'classnames';
import s from 'src/components/playlists/comments/style.module.less';
import React from 'react';

const Bubble = ({
  number,
  inline = false,
}: {
  number: number;
  inline?: boolean;
}) => {
  return number ? (
    <div className={c(s.bubble, { [s.inline]: inline })}>{number}</div>
  ) : null;
};

export default Bubble;
