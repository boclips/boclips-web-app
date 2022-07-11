import { BoInputText } from 'src/components/common/input/BoInputText';
import { Bodal } from 'src/components/common/bodal/Bodal';
import React, { useState } from 'react';
import { useEditPlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';

interface PlaylistForm {
  title: string;
  description?: string;
}

export interface Props {
  playlist: Collection;
  onCancel: () => void;
  onSuccess: (playlistId?: string, playlistName?: string) => void;
  onError: (playlistName: string) => void;
}

export const EditPlaylistBodal = ({
  playlist,
  onCancel,
  onSuccess,
  onError,
}: Props) => {
  const [playlistForm, setPlaylistForm] = useState<PlaylistForm>({
    title: playlist.title,
    description: playlist.description,
  });
  const [titleError, setTitleError] = useState<boolean>(false);
  const inputTextRef = React.useRef();

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
      const titleAfterUpdate = playlistForm.title;
      onSuccess(titleAfterUpdate);
    }
  }, [onSuccess, isSuccess, onError, isError, playlist]);

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

    editPlaylist({
      title,
      description: playlistForm.description,
    });
  };

  return (
    <Bodal
      title="Edit playlist"
      confirmButtonText="Save"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      dataQa="edit-playlist-modal"
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
          defaultValue={playlistForm.title}
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
        defaultValue={playlistForm.description}
      />
    </Bodal>
  );
};
