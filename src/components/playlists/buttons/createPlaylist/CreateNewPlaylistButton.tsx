import { Button } from 'boclips-ui';
import PlusSign from '@resources/icons/plus-sign.svg?react';
import React, { useState } from 'react';
import { CreatePlaylistModal } from '@components/playlistModal/createPlaylist/CreatePlaylistModal';
import { useNavigate } from 'react-router-dom';
import { displayNotification } from '@components/common/notification/displayNotification';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';

const CreateNewPlaylistButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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

  return (
    <>
      <Button
        icon={<PlusSign />}
        text="Create new playlist"
        onClick={() => setIsModalOpen(true)}
        height="48px"
        className="max-w-max"
      />
      {isModalOpen && (
        <CreatePlaylistModal
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default CreateNewPlaylistButton;
