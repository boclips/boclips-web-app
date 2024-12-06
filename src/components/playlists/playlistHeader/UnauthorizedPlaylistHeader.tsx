import React from 'react';
import c from 'classnames';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import PlaylistDescription from '@components/playlists/PlaylistDescription';
import { Typography } from 'boclips-ui';
import PlaylistLastUpdatedBadge from '@components/playlists/playlistHeader/PlaylistLastUpdatedBadge';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const UnauthorizedPlaylistHeader = ({ playlist }: Props) => {
  return (
    <section
      className={c(
        s.playlistHeaderContainer,
        'grid-row-start-2 grid-row-end-2 col-start-2 col-end-26',
      )}
      aria-labelledby="page-header"
    >
      <div>
        <Typography.H1
          id="page-header"
          size="md"
          className="text-gray-900"
          data-qa="playlistTitle"
        >
          {playlist.title}
        </Typography.H1>
        <div className={s.playlistBadges}>
          <Typography.Body
            as="div"
            size="small"
            aria-label={`playlist owned by ${playlist.ownerName.trim()}`}
            className={s.playlistBadge}
          >
            {`By: ${playlist.ownerName.trim()}`}
          </Typography.Body>
          <PlaylistLastUpdatedBadge playlist={playlist} />
        </div>
      </div>
      {playlist.description && (
        <PlaylistDescription description={playlist.description} />
      )}
    </section>
  );
};

export default UnauthorizedPlaylistHeader;
