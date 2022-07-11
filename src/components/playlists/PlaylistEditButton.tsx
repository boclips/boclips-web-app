import React, { useState } from 'react';
import Button from '@boclips-ui/button';
import PencilIcon from 'src/resources/icons/pencil.svg';
import c from 'classnames';
import { EditPlaylistModal } from 'src/components/playlistModal/EditPlaylistModal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

export const PlaylistEditButton = ({ playlist }: Props) => {
  const [showEditPlaylistModal, setShowEditPlaylistModal] =
    useState<boolean>(false);

  const handleEditPlaylistError = (playlistTitle: string) => {
    displayNotification(
      'error',
      `Error: Failed to edit playlist ${playlistTitle}`,
      'Please try again',
      `edit-playlist-failed`,
    );
  };

  return (
    <>
      <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
        <Button
          dataQa="edit-playlist-button"
          icon={<PencilIcon />}
          onClick={() => setShowEditPlaylistModal(true)}
          type="outline"
          text="Edit playlist"
        />
      </div>
      {showEditPlaylistModal && (
        <div className={s.playlistModalWrapper}>
          <EditPlaylistModal
            playlist={playlist}
            onCancel={() => setShowEditPlaylistModal(false)}
            onSuccess={() => setShowEditPlaylistModal(false)}
            onError={handleEditPlaylistError}
          />
        </div>
      )}
    </>
  );
};
