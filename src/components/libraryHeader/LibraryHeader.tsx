import React, { useState } from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import { BoInputText } from 'src/components/common/input/BoInputText';
import PlusSign from 'resources/icons/plus-sign.svg';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { useHistory } from 'react-router-dom';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { Bodal } from '../common/bodal/Bodal';

interface PlaylistForm {
  title?: string;
  description?: string;
}

export const LibraryHeader = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [playlistForm, setPlaylistForm] = useState<PlaylistForm>({});
  const [titleError, setTitleError] = useState<boolean>(false);
  const {
    mutate: createPlaylist,
    isSuccess,
    data,
    isError,
    isLoading,
  } = usePlaylistMutation();

  const history = useHistory();

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

  const handleModalClose = () => {
    setModalOpen(false);
    createButtonRef.current.focus();
  };

  const handleTitleChange = (title: string) =>
    setPlaylistForm({ ...playlistForm, title });

  const handleDescriptionChange = (description: string) =>
    setPlaylistForm({ ...playlistForm, description });

  React.useEffect(() => {
    if (isError) {
      displayNotification(
        'error',
        'Error: Failed to create new playlist',
        'Please refresh the page and try again',
      );
    }
    if (isSuccess) {
      history.push(`/library/${data}`);
    }
  }, [data, history, isSuccess, isError]);
  const playlistNameRef = React.useRef();
  const createButtonRef: React.RefObject<HTMLButtonElement> = React.useRef();

  return (
    <>
      <PageHeader
        title="Your Library"
        button={
          <Button
            icon={<PlusSign />}
            text="Create new playlist"
            onClick={() => setModalOpen(true)}
            width="206px"
            height="48px"
            ref={createButtonRef}
          />
        }
      />
      {modalOpen && (
        <Bodal
          title="Create new playlist"
          confirmButtonText="Create playlist"
          onConfirm={handleConfirm}
          onCancel={handleModalClose}
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
      )}
    </>
  );
};
