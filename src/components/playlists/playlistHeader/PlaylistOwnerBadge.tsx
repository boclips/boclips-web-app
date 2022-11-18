import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from '@boclips-ui/typography';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import s from './style.module.less';

interface Props {
  playlist: Collection | ListViewCollection;
}

const PlaylistOwnerBadge = ({ playlist }: Props) => {
  if (!playlist.ownerName || !playlist.ownerName.trim()) return null;

  const ownerName = playlist.mine ? 'You' : playlist.ownerName;

  return (
    <Typography.Body
      as="div"
      size="small"
      aria-label={`playlist owned by ${ownerName}`}
      className={s.playlistOwnerContainer}
    >
      {`By: ${ownerName}`}
    </Typography.Body>
  );
};

export default PlaylistOwnerBadge;
