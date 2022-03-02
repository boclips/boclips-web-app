import React, { useState } from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import PlusSign from 'resources/icons/plus-sign.svg';
import { useHistory } from 'react-router-dom';
import { CreatePlaylistBodal } from 'src/components/createPlaylistModal/createPlaylistBodal';
import { displayNotification } from 'src/components/common/notification/displayNotification';

export const LibraryHeader = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const history = useHistory();

  const handleModalClose = () => {
    setModalOpen(false);
    createButtonRef.current.focus();
  };

  const handleError = (playlistName: string) => {
    displayNotification(
      'error',
      'Error: Failed to create new playlist',
      'Please refresh the page and try again',
      `create-playlist-${playlistName}-failed`,
    );
  };
  const handleSuccess = (data: string) => {
    history.push(`/playlists/${data}`);
  };

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
        <CreatePlaylistBodal
          onCancel={handleModalClose}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};
