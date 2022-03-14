import React from 'react';
import { PlaylistShareButton } from 'src/components/playlists/PlaylistShareButton';
import { Constants } from 'src/AppConstants';
import c from 'classnames';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import PlaylistDescription from 'src/components/playlists/PlaylistDescription';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const PlaylistHeader = ({ playlist }: Props) => {
  const toLibraryLink = (id) => {
    return `${Constants.HOST}/playlists/${id}`;
  };

  return (
    <div
      className={c(
        s.playlistHeaderContainer,
        'grid-row-start-2 grid-row-end-2 col-start-2 col-end-26',
      )}
    >
      <Typography.H1
        size="md"
        className="order-first text-gray-900"
        data-qa="playlistTitle"
      >
        {playlist.title}
      </Typography.H1>
      <PlaylistShareButton link={toLibraryLink(playlist.id)} />
      {playlist.description && (
        <PlaylistDescription description={playlist.description} />
      )}
    </div>
  );
};

export default PlaylistHeader;
