import React, { useState } from 'react';
import Button from '@boclips-ui/button';
import { Video } from 'boclips-api-client/dist/types';
import TimerSVG from 'src/resources/icons/timer.svg';
import {
  useEditPlaylistMutation,
  usePlaylistQuery,
} from 'src/hooks/api/playlistsQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import BookmarkModal from 'src/components/shareCodeButton/playlistsBookmark/bookmarkModal/BookmarkModal';
import s from './style.module.less';

interface VideoShareCodeButtonProps {
  video: Video;
  playlistId: string;
}

const PlaylistVideoBookmarkButton = ({
  video,
  playlistId,
}: VideoShareCodeButtonProps) => {
  const { data: playlist } = usePlaylistQuery(playlistId);
  const { mutate: updatePlaylist } = useEditPlaylistMutation(playlist);
  const hasBookmark = !!playlist?.segments && !!playlist.segments[video.id];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModalVisibility = () => setIsModalVisible(!isModalVisible);

  const onConfirm = (
    segments: Record<string, { start: number; end: number }>,
  ) => {
    updatePlaylist(
      { segments },
      {
        onSuccess: () => {
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
        className={s.shareButton}
        iconOnly={false}
      />
      {isModalVisible && (
        <BookmarkModal
          onCancel={toggleModalVisibility}
          title={modalTitle}
          video={video}
          initialSegment={hasBookmark && playlist.segments[video.id]}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PlaylistVideoBookmarkButton;
