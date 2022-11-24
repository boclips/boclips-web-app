import React, { useState } from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import PlusSign from 'resources/icons/plus-sign.svg';
import { useNavigate } from 'react-router-dom';
import { CreatePlaylistModal } from 'src/components/playlistModal/CreatePlaylistModal';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';

export const PlaylistsHeader = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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
  const handleSuccess = (playlistId: string) => {
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistCreatedFromLibrary);
    navigate(`/playlists/${playlistId}`);
  };

  const createButtonRef: React.RefObject<HTMLButtonElement> = React.useRef();

  return (
    <>
      <PageHeader
        title="Playlists"
        button={
          <Button
            icon={<PlusSign />}
            text="Create new playlist"
            onClick={() => setModalOpen(true)}
            height="48px"
            ref={createButtonRef}
            className="max-w-max"
          />
        }
      />
      {modalOpen && (
        <CreatePlaylistModal
          onCancel={handleModalClose}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};
