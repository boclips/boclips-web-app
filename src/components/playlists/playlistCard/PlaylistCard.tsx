import React from 'react';
import { Link } from 'react-router-dom';
import s from '../style.module.less';

interface Props {
  name: string;
  link: string;
  header: React.ReactElement;
  footer?: React.ReactElement;
}

const PlaylistCard = ({ name, link, header, footer }: Props) => {
  return (
    <div className={s.playlistCard}>
      {header}
      <div className={s.header}>
        <Link
          to={{
            pathname: link,
            state: { name },
          }}
          aria-label={`${name} playlist`}
        >
          {name}
        </Link>
      </div>
      {footer}
    </div>
  );
};

export default PlaylistCard;
