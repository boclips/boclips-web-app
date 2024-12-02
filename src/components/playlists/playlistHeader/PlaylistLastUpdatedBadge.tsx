import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from 'boclips-ui';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import dayjs from 'dayjs';
import s from './style.module.less';

interface Props {
  playlist: Collection | ListViewCollection;
}

const PlaylistLastUpdatedBadge = ({ playlist }: Props) => {
  if (!playlist.updatedAt) return null;

  const lastUpdatedAt = dayjs(playlist.updatedAt).format('DD MMM YYYY');

  return (
    <Typography.Body
      as="div"
      size="small"
      aria-label={`Playlist last updated at ${lastUpdatedAt}`}
      className={s.playlistBadge}
    >
      {`Last updated ${lastUpdatedAt}`}
    </Typography.Body>
  );
};

export default PlaylistLastUpdatedBadge;
