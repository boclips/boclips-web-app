import React from 'react';
import { Link } from 'react-router-dom';
import s from '../style.module.less';

interface Props {
  name: string;
  id: string;
  header: React.ReactElement;
}

const PlaylistCard = ({ name, id, header }: Props) => {
  return (
    <Link
      to={{
        pathname: `/library/${id}`,
        state: { name },
      }}
      aria-label={`${name} playlist`}
      className={s.playlistCard}
    >
      {header}
      <div className={s.header}>{name}</div>
    </Link>
  );
};

export default PlaylistCard;
