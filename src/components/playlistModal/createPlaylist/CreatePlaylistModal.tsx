import React, { useState } from 'react';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import {
  PlaylistFormProps,
  PlaylistModal,
} from 'src/components/playlistModal/PlaylistModal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';

export interface Props {
  title?: string;
  videoId?: string;
  playlist?: Collection;
  onCancel: () => void;
  onSuccess: (playlistId?: string, playlistName?: string) => void;
  onError: (playlistName: string) => void;
}

export const CreatePlaylistModal = ({
  title = 'Create new playlist',
  videoId = null,
  playlist = null,
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

  const handleConfirm = (
    playlistTitle: string,
    playlistDescription?: string,
  ) => {
    setPlaylistFormUsedInMutation({
      title: playlistTitle,
      description: playlistDescription,
    });
    let videos = [];
    if (playlist) {
      videos = playlist.videos.map((video) => video.id);
    } else if (videoId) {
      videos = [videoId];
    }

    createPlaylist({
      title: playlistTitle,
      description: playlistDescription,
      origin: 'BO_WEB_APP',
      videos,
    });
  };

  return (
    <PlaylistModal
      playlist={playlist}
      handleConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      title={title}
      confirmButtonText="Create playlist"
    />
  );
};
