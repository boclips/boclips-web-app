import React, { useEffect, useState } from 'react';
import Button from '@boclips-ui/button';
import { Video } from 'boclips-api-client/dist/types';
import PencilSVG from 'src/resources/icons/pencil.svg';
import {
  useEditPlaylistMutation,
  usePlaylistQuery,
} from 'src/hooks/api/playlistsQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import NoteModal from 'src/components/playlists/buttons/playlistNote/noteModal/NoteModal';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import { CollectionAssetRequest } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import s from '../style.module.less';

interface PlaylistVideoShareButtonProps {
  video: Video;
  playlistId: string;
}

const PlaylistVideoNoteButton = ({
  video,
  playlistId,
}: PlaylistVideoShareButtonProps) => {
  const { data: playlist } = usePlaylistQuery(playlistId);
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();
  const { mutate: updatePlaylist } = useEditPlaylistMutation(playlist);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assets, setAssets] = useState<CollectionAsset[]>();

  const assetNotes = (
    videoId: string,
    highlightId?: string,
  ): string | undefined => {
    const foundAsset = assets?.find(
      (asset) =>
        asset.id.videoId === videoId && asset.id.highlightId === highlightId,
    );
    return foundAsset?.note;
  };

  const hasNotes = !!assets && !!assetNotes(video.id);

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

  const updateAssetNote = (
    videoId: string,
    note: string,
    highlightId?: string,
  ) => {
    const indexToReplace = assets.findIndex(
      (asset) =>
        asset.id.videoId === videoId && asset.id.highlightId === highlightId,
    );

    if (indexToReplace !== -1) {
      assets[indexToReplace] = {
        ...assets[indexToReplace],
        note,
      };
    }
  };

  const onConfirm = (videoId: string, note: string, highlightId?: string) => {
    updateAssetNote(videoId, note, highlightId);
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
    ? `Update note for '${video.title}'`
    : `Add note for '${video.title}'`;
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
          video={video}
          initialNote={(hasNotes && assetNotes(video.id)) || ''}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PlaylistVideoNoteButton;
