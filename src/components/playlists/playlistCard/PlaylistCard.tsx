import React from 'react';
import { Link } from 'react-router-dom';
import s from '../style.module.less';

interface Props {
  name: string;
  link: string;
  header: React.ReactElement;
}

const PlaylistCard = ({ name, link, header }: Props) => {
  return (
    <Link
      to={{
        pathname: link,
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
