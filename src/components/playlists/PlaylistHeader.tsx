import React from 'react';
import { PlaylistShareButton } from 'src/components/playlists/PlaylistShareButton';
import { Constants } from 'src/AppConstants';
import c from 'classnames';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import PlaylistDescription from 'src/components/playlists/PlaylistDescription';
import { Typography } from '@boclips-ui/typography';
import { PlaylistEditButton } from 'src/components/playlists/PlaylistEditButton';
import PlaylistNavigation from 'src/components/playlists/PlaylistNavigation';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const PlaylistHeader = ({ playlist }: Props) => {
  const toLibraryLink = (id) => {
    return `${Constants.HOST}/playlists/${id}`;
  };

  return (
    <section
      className={c(
        s.playlistHeaderContainer,
        'grid-row-start-2 grid-row-end-2 col-start-2 col-end-26',
      )}
      aria-labelledby="page-header"
    >
      <PlaylistNavigation playlist={playlist} />
      <Typography.H1
        id="page-header"
        size="md"
        className="text-gray-900"
        data-qa="playlistTitle"
      >
        {playlist.title}
      </Typography.H1>
      <div className={s.playlistButtons}>
        <PlaylistShareButton link={toLibraryLink(playlist.id)} />
        {playlist.mine && <PlaylistEditButton playlist={playlist} />}
      </div>
      {playlist.description && (
        <PlaylistDescription description={playlist.description} />
      )}
    </section>
  );
};

export default PlaylistHeader;
