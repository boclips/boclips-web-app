import { BoInputText } from 'src/components/common/input/BoInputText';
import { Bodal } from 'src/components/common/bodal/Bodal';
import React, { useState } from 'react';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';

interface PlaylistForm {
  title?: string;
  description?: string;
}

export interface Props {
  onCancel: () => void;
  onSuccess: (data) => void;
}

export const CreatePlaylistBodal = ({ onCancel, onSuccess }: Props) => {
  const [playlistForm, setPlaylistForm] = useState<PlaylistForm>({});
  const [titleError, setTitleError] = useState<boolean>(false);
  const playlistNameRef = React.useRef();
  const {
    mutate: createPlaylist,
    isSuccess,
    data,
    isError,
    isLoading,
  } = usePlaylistMutation();

  React.useEffect(() => {
    if (isError) {
      displayNotification(
        'error',
        'Error: Failed to create new playlist',
        'Please refresh the page and try again',
        `create-playlist-${playlistForm.title}-failed`,
      );
    }
    if (isSuccess) {
      onSuccess(data);
    }
  }, [data, onSuccess, isSuccess, isError]);

  const handleTitleChange = (title: string) =>
    setPlaylistForm({ ...playlistForm, title });

  const handleDescriptionChange = (description: string) =>
    setPlaylistForm({ ...playlistForm, description });

  const handleConfirm = () => {
    const title = playlistForm.title;
    if (title == null || title === '') {
      setTitleError(true);
      return;
    }

    createPlaylist({
      title,
      description: playlistForm.description,
      origin: 'BO_WEB_APP',
      videos: [],
    });
  };
  return (
    <Bodal
      title="Create new playlist"
      confirmButtonText="Create playlist"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      initialFocusInputRef={playlistNameRef}
    >
      <BoInputText
        label="Playlist name"
        placeholder="Add name"
        constraints={{ required: true }}
        onChange={handleTitleChange}
        error={titleError}
        errorMessage="Playlist name is required"
        inputType="text"
        ref={playlistNameRef}
      />
      <BoInputText
        label="Description"
        placeholder="Add description"
        onChange={handleDescriptionChange}
        inputType="textarea"
      />
    </Bodal>
  );
};
