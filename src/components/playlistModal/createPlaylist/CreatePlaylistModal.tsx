import React, { useEffect, useState } from 'react';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import {
  PlaylistFormProps,
  PlaylistModal,
} from 'src/components/playlistModal/PlaylistModal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { CollectionAssetId } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';

export interface Props {
  title?: string;
  assetId?: CollectionAssetId;
  playlist?: Collection;
  onCancel: () => void;
  onSuccess: (playlistId?: string, playlistName?: string) => void;
  onError: (playlistName: string) => void;
}

export const CreatePlaylistModal = ({
  title = 'Create new playlist',
  assetId = null,
  playlist = null,
  onCancel,
  onSuccess,
  onError,
}: Props) => {
  const {
    mutate: createPlaylist,
    isSuccess,
    data: playlistId,
    isError,
    isLoading,
  } = usePlaylistMutation();

  const [playlistFormUsedInMutation, setPlaylistFormUsedInMutation] = useState<
    PlaylistFormProps | undefined
  >(undefined);

  useEffect(() => {
    if (isError) {
      onError(playlistFormUsedInMutation?.title);
    }
    if (isSuccess) {
      onSuccess(playlistId, playlistFormUsedInMutation?.title);
    }
  }, [playlistId, onSuccess, isSuccess, isError]);

  const handleConfirm = (
    playlistTitle: string,
    playlistDescription?: string,
  ) => {
    setPlaylistFormUsedInMutation({
      title: playlistTitle,
      description: playlistDescription,
    });
    let assets = [];
    if (playlist) {
      assets = playlist.assets.map((asset) => {
        return {
          videoId: asset.id.videoId,
          highlightId: asset.id.highlightId,
        };
      });
    } else if (assetId) {
      assets = [
        {
          videoId: assetId.videoId,
          highlightId: assetId.highlightId,
        },
      ];
    }

    createPlaylist({
      title: playlistTitle,
      description: playlistDescription,
      assets,
    });
  };

  return (
    <PlaylistModal
      playlist={playlist}
      handleConfirm={handleConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      title={title}
      confirmButtonText="Create playlist"
    />
  );
};
