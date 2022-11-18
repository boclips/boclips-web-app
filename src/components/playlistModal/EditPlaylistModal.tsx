// @ts-nocheck

import React, { useState } from 'react';
import { useEditPlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import {
  PlaylistFormProps,
  PlaylistModal,
} from 'src/components/playlistModal/PlaylistModal';

export interface Props {
  playlist: Collection;
  onCancel: () => void;
  onSuccess: (playlistId?: string, playlistName?: string) => void;
  onError: (playlistName: string) => void;
}

export const EditPlaylistModal = ({
  playlist,
  onCancel,
  onSuccess,
  onError,
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
      onError(titleBeforeUpdate);
    }
    if (isSuccess) {
      const titleAfterUpdate = playlistFormUsedInMutation.title;
      onSuccess(titleAfterUpdate);
    }
  }, [onSuccess, isSuccess, onError, isError, playlist]);

  const handleConfirm = (title: string, description?: string) => {
    setPlaylistFormUsedInMutation({ title, description });

    editPlaylist({
      title,
      description,
    });
  };

  return (
    <PlaylistModal
      playlist={playlist}
      handleConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      title="Edit playlist"
      confirmButtonText="Save"
    />
  );
};
