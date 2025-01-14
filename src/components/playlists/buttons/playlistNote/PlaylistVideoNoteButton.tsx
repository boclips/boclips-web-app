import React, { useEffect, useState } from 'react';
import Button from '@boclips-ui/button';
import PencilSVG from 'src/resources/icons/pencil.svg';
import {
  useEditPlaylistMutation,
  usePlaylistQuery,
} from 'src/hooks/api/playlistsQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import NoteModal from 'src/components/playlists/buttons/playlistNote/noteModal/NoteModal';
import {
  CollectionAsset,
  CollectionAssetId,
} from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import { CollectionAssetRequest } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import s from '../style.module.less';

interface PlaylistVideoShareButtonProps {
  selectedAsset: CollectionAsset;
  playlistId: string;
}

const PlaylistVideoNoteButton = ({
  selectedAsset,
  playlistId,
}: PlaylistVideoShareButtonProps) => {
  const { data: playlist } = usePlaylistQuery(playlistId);
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();
  const { mutate: updatePlaylist } = useEditPlaylistMutation(playlist);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assets, setAssets] = useState<CollectionAsset[]>();

  const assetNotes = (assetId: CollectionAssetId): string | undefined => {
    const foundAsset = assets?.find(
      (asset) =>
        asset.id.videoId === assetId.videoId &&
        asset.id.highlightId === assetId.highlightId,
    );
    return foundAsset?.note;
  };

  const hasNotes = !!assets && !!assetNotes(selectedAsset.id);

  useEffect(() => {
    if (!playlist) return;
    setAssets(playlist.assets);
  }, [playlist]);

  const analyticsType: string = hasNotes ? 'UPDATE_NOTE' : 'SET_NOTE';
  const toggleModalVisibility = () => {
    if (!isModalVisible) {
      trackPlatformInteraction({
        subtype: `${analyticsType}_MODAL_OPENED`,
        anonymous: false,
      });
    }
    setIsModalVisible(!isModalVisible);
  };

  const convertToCollectionAssetRequest = (
    asset: CollectionAsset,
  ): CollectionAssetRequest => ({
    videoId: asset.id.videoId,
    highlightId: asset.id.highlightId,
    segment: asset.segment,
    note: asset.note,
  });

  const updateAssetNote = (assetId: CollectionAssetId, note: string) => {
    const indexToReplace = assets.findIndex(
      (asset) =>
        asset.id.videoId === assetId.videoId &&
        asset.id.highlightId === assetId.highlightId,
    );

    if (indexToReplace !== -1) {
      assets[indexToReplace] = {
        ...assets[indexToReplace],
        note,
      };
    }
  };

  const onConfirm = (assetId: CollectionAssetId, note: string) => {
    updateAssetNote(assetId, note);
    updatePlaylist(
      {
        assets: assets.map(convertToCollectionAssetRequest),
      },
      {
        onSuccess: () => {
          trackPlatformInteraction({
            subtype: `${analyticsType}_MODAL_SUBMITTED`,
            anonymous: false,
          });
          displayNotification('success', 'Video note has been updated', '', '');
        },
        onError: () => {
          displayNotification(
            'error',
            'An error occurred, please try again',
            '',
            '',
          );
        },
      },
    );
    toggleModalVisibility();
  };

  const modalTitle = hasNotes
    ? `Update note for '${selectedAsset.video.title}'`
    : `Add note for '${selectedAsset.video.title}'`;
  const mainButtonCopy = hasNotes ? 'Edit Note' : 'Add Note';
  const mainButtonIcon = hasNotes ? <PencilSVG /> : null;

  return (
    <>
      <Button
        onClick={toggleModalVisibility}
        dataQa="note-video-button"
        text={mainButtonCopy}
        aria-label="Note"
        icon={mainButtonIcon}
        height="44px"
        className={s.playlistButton}
        iconOnly={false}
      />
      {isModalVisible && (
        <NoteModal
          onCancel={toggleModalVisibility}
          title={modalTitle}
          assetId={selectedAsset.id}
          initialNote={(hasNotes && assetNotes(selectedAsset.id)) || ''}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PlaylistVideoNoteButton;
