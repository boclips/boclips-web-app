import React, { useState } from 'react';
import { BoInputText } from 'src/components/common/input/BoInputText';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';

interface Props {
  playlist?: Collection;
  handleConfirm: (title: string, description?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  title: string;
  confirmButtonText: string;
}

export interface PlaylistFormProps {
  title: string;
  description?: string;
}

export const PlaylistModal = ({
  playlist,
  handleConfirm,
  onCancel,
  isLoading,
  title,
  confirmButtonText,
}: Props) => {
  const [playlistForm, setPlaylistForm] = useState<PlaylistFormProps>({
    title: playlist?.title || '',
    description: playlist?.description || '',
  });
  const [titleError, setTitleError] = useState<boolean>(false);
  const inputTextRef = React.useRef();

  const handleTitleChange = (newTitle: string) =>
    setPlaylistForm({ ...playlistForm, title: newTitle });

  const handleDescriptionChange = (description: string) =>
    setPlaylistForm({ ...playlistForm, description });

  const validate = () => {
    const userTitle = playlistForm.title;
    if (userTitle == null || userTitle === '') {
      setTitleError(true);
    }
  };

  const onConfirm = () => {
    validate();
    handleConfirm(playlistForm.title, playlistForm.description);
  };

  return (
    <Bodal
      title={title}
      confirmButtonText={confirmButtonText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      dataQa="playlist-modal"
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
