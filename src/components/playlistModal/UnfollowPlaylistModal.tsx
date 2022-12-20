import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { useUnfollowPlaylistMutation } from 'src/hooks/api/playlistsQuery';
import s from './style.module.less';

export interface Props {
  playlist: Collection;
  onCancel: () => void;
}

export const UnfollowPlaylistModal = ({ playlist, onCancel }: Props) => {
  const { mutate: unfollowPlaylist, isLoading } =
    useUnfollowPlaylistMutation(playlist);

  return (
    <div className={s.playlistModalWrapper}>
      <Bodal
        title="Unfollow playlist"
        confirmButtonText="Yes, unfollow"
        onConfirm={unfollowPlaylist}
        onCancel={onCancel}
        isLoading={isLoading}
      >
        <div className="flex flex-col">
          <Typography.Body className="mt-3">
            Unfollow
            <Typography.Body weight="medium">
              {` ${playlist.title} `}
            </Typography.Body>
            playlist?
          </Typography.Body>
        </div>
      </Bodal>
    </div>
  );
};
