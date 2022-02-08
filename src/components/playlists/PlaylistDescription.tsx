import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  description: string;
}

const PlaylistDescription = ({ description }: Props) => {
  return (
    <div
      className={c(
        s.description,
        'grid-row-start-3 grid-row-end-3 col-start-2 col-end-26',
      )}
    >
      {description}
    </div>
  );
};

export default PlaylistDescription;
