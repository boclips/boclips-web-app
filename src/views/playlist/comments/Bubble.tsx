import c from 'classnames';
import s from 'src/views/playlist/comments/style.module.less';
import React from 'react';

const Bubble = ({
  number,
  inline = false,
}: {
  number: number;
  inline?: boolean;
}) => {
  return <div className={c(s.bubble, { [s.inline]: inline })}>{number}</div>;
};

export default Bubble;
