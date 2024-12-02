import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from 'boclips-ui';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { useGetUserQuery } from '@src/hooks/api/userQuery';
import s from './style.module.less';

interface Props {
  playlist: Collection | ListViewCollection;
}

const PlaylistOwnerBadge = ({ playlist }: Props) => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery();

  function getOwnerName() {
    if (playlist.mine) {
      return 'You';
    }
    if (playlist.createdBy === 'Boclips') {
      if (!userIsLoading && user?.account?.name === 'Boclips') {
        return `${playlist.ownerName} (Boclips)`;
      }
      return 'Boclips';
    }
    return !playlist.ownerName || !playlist.ownerName.trim()
      ? null
      : playlist.ownerName;
  }

  const ownerName = getOwnerName();

  return (
    ownerName && (
      <Typography.Body
        as="div"
        size="small"
        aria-label={`playlist owned by ${ownerName}`}
        className={s.playlistBadge}
      >
        {`By: ${ownerName}`}
      </Typography.Body>
    )
  );
};

export default PlaylistOwnerBadge;
