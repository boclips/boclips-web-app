import { CreatePlaylistModal } from '@components/playlistModal/createPlaylist/CreatePlaylistModal';
import React from 'react';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';

interface Props {
  playlist: Collection;
  showSuccessNotification: (message: string, dataQa: string) => void;
  showErrorNotification: (message: string, dataQa: string) => void;
  onCancel: () => void;
}

export const CopyPlaylistModal = ({
  playlist,
  showSuccessNotification,
  showErrorNotification,
  onCancel,
}: Props) => {
  const handleCopyPlaylistSuccess = (_, playlistTitle: string) => {
    showSuccessNotification(
      `Playlist "${playlistTitle}" has been created`,
      'copy-playlist-success',
    );
  };

  const handleCopyPlaylistError = () => {
    showErrorNotification(
      `Error: Failed to duplicate playlist "${playlist.title}"`,
      'copy-playlist-failed',
    );
  };

  return (
    <CreatePlaylistModal
      title="Make a copy"
      playlist={{
        ...playlist,
        title: `Copy of ${playlist.title}`,
      }}
      onCancel={onCancel}
      onSuccess={handleCopyPlaylistSuccess}
      onError={handleCopyPlaylistError}
    />
  );
};
