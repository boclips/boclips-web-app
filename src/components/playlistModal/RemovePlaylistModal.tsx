import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

export interface Props {
  playlist: Collection;
  onCancel: () => void;
  showErrorNotification: (message: string, dataQa: string) => void;
}

export const RemovePlaylistModal = ({
  playlist,
  onCancel,
  showErrorNotification,
}: Props) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/playlists');
    showErrorNotification(
      `Error: Failed to remove playlist "${playlist.title}"`,
      'remove-playlist-failed',
    );
  };

  return (
    <div className={s.playlistModalWrapper}>
      <Bodal
        title="Remove playlist"
        confirmButtonText="Yes, remove it"
        onConfirm={handleConfirm}
        onCancel={onCancel}
        isLoading={false}
        dataQa="remove-playlist-modal"
        className={s.bodal}
      >
        <div className="flex flex-col">
          <Typography.Body className="mt-3">
            Are you sure you want to remove <b>{playlist.title}</b> playlist?
          </Typography.Body>
          <Typography.Body className="mt-2 mb-2.5">
            Removing a playlist is a permanent action and cannot be undone.
          </Typography.Body>
        </div>
      </Bodal>
    </div>
  );
};
