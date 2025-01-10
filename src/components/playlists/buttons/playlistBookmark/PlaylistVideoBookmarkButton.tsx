import React, { useEffect, useState } from 'react';
import Button from '@boclips-ui/button';
import { Video } from 'boclips-api-client/dist/types';
import TimerSVG from 'src/resources/icons/timer.svg';
import {
  useEditPlaylistMutation,
  usePlaylistQuery,
} from 'src/hooks/api/playlistsQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import BookmarkModal from 'src/components/playlists/buttons/playlistBookmark/bookmarkModal/BookmarkModal';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import { Segment } from 'boclips-api-client/dist/sub-clients/collections/model/Segment';
import { CollectionAssetRequest } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import s from '../style.module.less';

interface PlaylistVideoShareButtonProps {
  video: Video;
  playlistId: string;
}

const PlaylistVideoBookmarkButton = ({
  video,
  playlistId,
}: PlaylistVideoShareButtonProps) => {
  const { data: playlist } = usePlaylistQuery(playlistId);
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();
  const { mutate: updatePlaylist } = useEditPlaylistMutation(playlist);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assets, setAssets] = useState<CollectionAsset[]>(playlist.assets);

  const assetSegment = (
    videoId: string,
    highlightId?: string,
  ): Segment | undefined => {
    const foundAsset = assets.find(
      (asset) =>
        asset.id.videoId === videoId && asset.id.highlightId === highlightId,
    );
    return foundAsset.segment;
  };
  const hasBookmark = !!assets && !!assetSegment(video.id);

  useEffect(() => {
    if (!playlist) return;
    setAssets(assets);
  }, [assets, playlist]);

  const analyticsType: string = hasBookmark
    ? 'UPDATE_BOOKMARK'
    : 'SET_BOOKMARK';
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

  const updateAssetSegment = (
    videoId: string,
    segment: Segment,
    highlightId?: string,
  ) => {
    const indexToReplace = assets.findIndex(
      (asset) =>
        asset.id.videoId === videoId && asset.id.highlightId === highlightId,
    );

    if (indexToReplace !== -1) {
      assets[indexToReplace] = {
        ...assets[indexToReplace],
        segment,
      };
    }
  };

  const onConfirm = (videoId: string, segment: Segment) => {
    updateAssetSegment(videoId, segment);

    updatePlaylist(
      { assets: assets.map(convertToCollectionAssetRequest) },
      {
        onSuccess: () => {
          trackPlatformInteraction({
            subtype: `${analyticsType}_MODAL_SUBMITTED`,
            anonymous: false,
          });
          displayNotification(
            'success',
            'Video bookmark has been updated',
            '',
            '',
          );
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

  const modalTitle = hasBookmark
    ? 'Update bookmarked timings for this video'
    : 'Bookmark custom timings for this video';
  const mainButtonCopy = hasBookmark ? 'Edit Bookmark' : 'Bookmark';
  const mainButtonIcon = hasBookmark ? <TimerSVG /> : null;

  return (
    <>
      <Button
        onClick={toggleModalVisibility}
        dataQa="bookmark-video-button"
        text={mainButtonCopy}
        aria-label="Bookmark"
        icon={mainButtonIcon}
        height="44px"
        className={s.playlistButton}
        iconOnly={false}
      />
      {isModalVisible && (
        <BookmarkModal
          onCancel={toggleModalVisibility}
          title={modalTitle}
          video={video}
          initialSegment={hasBookmark && assetSegment(video.id)}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PlaylistVideoBookmarkButton;
