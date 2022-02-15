import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  description: string;
}

const PlaylistDescription = ({ description }: Props) => {
  return (
    <div className={c(s.description, 'md:order-last sm:order-2')}>
      {description}
    </div>
  );
};

export default PlaylistDescription;
