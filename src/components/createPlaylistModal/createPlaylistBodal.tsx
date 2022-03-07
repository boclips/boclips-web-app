import { BoInputText } from 'src/components/common/input/BoInputText';
import { Bodal } from 'src/components/common/bodal/Bodal';
import React, { useState } from 'react';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';

interface PlaylistForm {
  title?: string;
  description?: string;
}

export interface Props {
  videoId?: string;
  onCancel: () => void;
  onSuccess: (playlistId?: string, playlistName?: string) => void;
  onError: (playlistName: string) => void;
}

export const CreatePlaylistBodal = ({
  videoId = null,
  onCancel,
  onSuccess,
  onError,
}: Props) => {
  const [playlistForm, setPlaylistForm] = useState<PlaylistForm>({});
  const [titleError, setTitleError] = useState<boolean>(false);
  const inputTextRef = React.useRef();

  const {
    mutate: createPlaylist,
    isSuccess,
    data,
    isError,
    isLoading,
  } = usePlaylistMutation();

  React.useEffect(() => {
    if (isError) {
      onError(playlistForm.title);
    }
    if (isSuccess) {
      onSuccess(data, playlistForm.title);
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

    let videos = [];
    if (videoId) {
      videos = [videoId];
    }

    createPlaylist({
      title,
      description: playlistForm.description,
      origin: 'BO_WEB_APP',
      videos,
    });
  };

  return (
    <Bodal
      title="Create new playlist"
      confirmButtonText="Create playlist"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      dataQa="create-playlist-modal"
      initialFocusRef={inputTextRef}
    >
      <div className="pb-6">
        <BoInputText
          id="playlist-name"
          labelText="Playlist name"
          placeholder="Add name"
          constraints={{ required: true }}
          onChange={handleTitleChange}
          isError={titleError}
          errorMessage="Playlist name is required"
          inputType="text"
          ref={inputTextRef}
          height="48px"
        />
      </div>
      <BoInputText
        id="playlist-description"
        labelText="Description"
        placeholder="Add description"
        onChange={handleDescriptionChange}
        inputType="textarea"
      />
    </Bodal>
  );
};
