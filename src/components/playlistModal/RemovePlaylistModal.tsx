import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Bodal } from '@components/common/bodal/Bodal';
import { Typography } from 'boclips-ui';
import { useRemovePlaylistMutation } from '@src/hooks/api/playlistsQuery';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';
import s from './style.module.less';

export interface Props {
  playlist: Collection;
  onCancel: () => void;
}

export const RemovePlaylistModal = ({ playlist, onCancel }: Props) => {
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();

  const {
    mutate: removePlaylist,
    isLoading,
    isSuccess,
  } = useRemovePlaylistMutation(playlist);

  React.useEffect(() => {
    if (isSuccess) {
      trackPlatformInteraction({ subtype: 'PLAYLIST_REMOVED' });
    }
  });

  return (
    <div className={s.playlistModalWrapper}>
      <Bodal
        title="Remove playlist"
        confirmButtonText="Yes, remove it"
        onConfirm={removePlaylist}
        onCancel={onCancel}
        isLoading={isLoading}
      >
        <div className="flex flex-col">
          <Typography.Body className="mt-3">
            Are you sure you want to remove
            <Typography.Body weight="medium">
              {` ${playlist.title} `}
            </Typography.Body>
            playlist?
          </Typography.Body>
          <Typography.Body className="mt-2 mb-2.5">
            Removing a playlist is a permanent action and cannot be undone.
          </Typography.Body>
        </div>
      </Bodal>
    </div>
  );
};
