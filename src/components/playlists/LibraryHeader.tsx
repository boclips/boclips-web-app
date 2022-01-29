import React, { useState } from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import { BoInput } from 'src/components/common/input/BoInput/BoInput';
import PlusSign from 'resources/icons/plus-sign.svg';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { useHistory } from 'react-router-dom';
import { displayErrorNotification } from 'src/components/common/errors/displayErrorNotification';
import { BoTextArea } from '../common/input/BoInput/BoTextArea';
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

  const handleTitleChange = (title: string) =>
    setPlaylistForm({ ...playlistForm, title });

  const handleDescriptionChange = (description: string) =>
    setPlaylistForm({ ...playlistForm, description });

  React.useEffect(() => {
    if (isError) {
      displayErrorNotification(
        'create-playlist',
        'Error: Failed to create new playlist',
        'Please refresh the page and try again',
      );
    }
    if (isSuccess) {
      history.push(`/library/${data}`);
    }
  }, [data, history, isSuccess, isError]);

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
          />
        }
      />

      {modalOpen && (
        <Bodal
          title="Create new playlist"
          confirmButtonText="Create playlist"
          onConfirm={handleConfirm}
          onCancel={() => setModalOpen(false)}
        >
          <BoInput
            label="Playlist name"
            placeholder="Give it a name"
            constraints={{ required: true }}
            onChange={handleTitleChange}
            error={titleError}
            errorMessage="Playlist name is required"
          />
          <BoTextArea
            label="Description"
            placeholder="Add description"
            onChange={handleDescriptionChange}
          />
        </Bodal>
      )}
    </>
  );
};
