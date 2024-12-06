import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import c from 'classnames';
import s from '@components/playlists/style.module.less';
import { Link } from '@components/common/Link';
import Arrow from '@resources/icons/grey-arrow.svg?react';
import React from 'react';

interface Props {
  playlist: Collection;
}

const PlaylistNavigation = ({ playlist }: Props) => {
  return (
    <nav
      aria-label="Playlists"
      className={c(s.playlistNavigation, 'order-first')}
    >
      <Link to="/playlists" data-qa="to-library-link">
        Playlists
      </Link>
      <Arrow />
      <Link to={`/playlists/${playlist.id}`} data-qa="playlist-title-link">
        {playlist.title}
      </Link>
    </nav>
  );
};

export default PlaylistNavigation;
