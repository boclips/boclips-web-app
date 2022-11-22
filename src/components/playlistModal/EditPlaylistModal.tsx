// @ts-nocheck

import React, { useState } from 'react';
import { useEditPlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import {
  PlaylistFormProps,
  PlaylistModal,
} from 'src/components/playlistModal/PlaylistModal';
import s from 'src/components/playlists/playlistHeader/style.module.less';

export interface Props {
  playlist: Collection;
  onCancel: () => void;
  showSuccessNotification: (message: string, dataQa: string) => void;
  showErrorNotification: (message: string, dataQa: string) => void;
}

export const EditPlaylistModal = ({
  playlist,
  onCancel,
  showSuccessNotification,
  showErrorNotification,
}: Props) => {
  const [playlistFormUsedInMutation, setPlaylistFormUsedInMutation] = useState<
    PlaylistFormProps | undefined
  >(undefined);

  const {
    mutate: editPlaylist,
    isSuccess,
    isError,
    isLoading,
  } = useEditPlaylistMutation(playlist);

  React.useEffect(() => {
    if (isError) {
      const titleBeforeUpdate = playlist.title;
      handleEditPlaylistError(titleBeforeUpdate);
    }
    if (isSuccess) {
      const titleAfterUpdate = playlistFormUsedInMutation.title;
      handleEditPlaylistSuccess(titleAfterUpdate);
    }
  }, [
    showSuccessNotification,
    isSuccess,
    showErrorNotification,
    isError,
    playlist,
  ]);

  const handleEditPlaylistSuccess = (playlistTitle: string) => {
    showSuccessNotification(
      `Playlist "${playlistTitle}" edited`,
      'edit-playlist-success',
    );
  };

  const handleEditPlaylistError = (playlistTitle: string) => {
    showErrorNotification(
      `Error: Failed to edit playlist "${playlistTitle}"`,
      'edit-playlist-failed',
    );
  };

  const handleConfirm = (title: string, description?: string) => {
    setPlaylistFormUsedInMutation({ title, description });

    editPlaylist({
      title,
      description,
    });
  };

  return (
    <div className={s.playlistModalWrapper}>
      <PlaylistModal
        playlist={playlist}
        handleConfirm={handleConfirm}
        onCancel={onCancel}
        isLoading={isLoading}
        title="Edit playlist"
        confirmButtonText="Save"
      />
    </div>
  );
};
