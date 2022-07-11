import React, { useState } from 'react';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import {
  PlaylistFormProps,
  PlaylistModal,
} from 'src/components/playlistModal/PlaylistModal';

export interface Props {
  videoId?: string;
  onCancel: () => void;
  onSuccess: (playlistId?: string, playlistName?: string) => void;
  onError: (playlistName: string) => void;
}

export const CreatePlaylistModal = ({
  videoId = null,
  onCancel,
  onSuccess,
  onError,
}: Props) => {
  const {
    mutate: createPlaylist,
    isSuccess,
    data: playlistId,
    isError,
    isLoading,
  } = usePlaylistMutation();

  const [playlistFormUsedInMutation, setPlaylistFormUsedInMutation] = useState<
    PlaylistFormProps | undefined
  >(undefined);

  React.useEffect(() => {
    if (isError) {
      onError(playlistFormUsedInMutation?.title);
    }
    if (isSuccess) {
      onSuccess(playlistId, playlistFormUsedInMutation?.title);
    }
  }, [playlistId, onSuccess, isSuccess, isError]);

  const handleConfirm = (title: string, description?: string) => {
    setPlaylistFormUsedInMutation({ title, description });
    let videos = [];
    if (videoId) {
      videos = [videoId];
    }

    createPlaylist({
      title,
      description,
      origin: 'BO_WEB_APP',
      videos,
    });
  };

  return (
    <PlaylistModal
      handleConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      title="Create new playlist"
      confirmButtonText="Create playlist"
    />
  );
};
