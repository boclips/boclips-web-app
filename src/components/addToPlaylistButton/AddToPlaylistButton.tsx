import Tooltip, { Button, Typography } from 'boclips-ui';
import PlaylistAddIcon from '@resources/icons/playlist-add.svg?react';
import PlaylistAddAlreadyAddedIcon from '@resources/icons/playlist-add-already-added.svg?react';
import React, { useRef, useState } from 'react';
import CloseButton from '@resources/icons/cross-icon.svg?react';
import {
  useAddToPlaylistMutation,
  useOwnAndEditableSharedPlaylistsQuery,
  useRemoveFromPlaylistMutation,
} from '@src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import c from 'classnames';
import CloseOnClickOutside from '@src/hooks/closeOnClickOutside';
import BoCheckbox from '@src/components/common/input/BoCheckbox';
import FocusTrap from 'focus-trap-react';
import { handleEscapeKeyEvent } from '@src/services/handleKeyEvent';
import { CreatePlaylistModal } from '@src/components/playlistModal/createPlaylist/CreatePlaylistModal';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import PlusIcon from '@resources/icons/plus-sign.svg?react';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { LoadingOutlined } from '@ant-design/icons';
import s from './style.module.less';

interface Props {
  videoId: string;
  onCleanup?: (playlistId: string, buttonCleanUp: () => void) => void;
  onClick?: () => void;
}

export const AddToPlaylistButton = ({ videoId, onCleanup, onClick }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] =
    useState<boolean>(false);

  const [playlistsContainingVideo, setPlaylistsContainingVideo] = useState<
    string[]
  >([]);

  const ref = useRef(null);

  CloseOnClickOutside(ref, () => setIsOpen(false));

  const { data: playlists, isLoading } =
    useOwnAndEditableSharedPlaylistsQuery();

  const playlistCreatedHotjarEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.PlaylistCreatedFromVideo);
  };
  const videoAddedHotjarEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.VideoAddedToPlaylist);
  };
  const videoRemovedHotjarEvent = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.VideoRemovedFromPlaylist);
  };

  const uncheckPlaylistForVideo = (id: string) =>
    setPlaylistsContainingVideo((prevState) =>
      prevState.filter((plId) => plId !== id),
    );

  const checkPlaylistForVideo = (id: string) =>
    setPlaylistsContainingVideo((prevState) => [...prevState, id]);

  const { mutate: mutateRemoveFromPlaylist } = useRemoveFromPlaylistMutation({
    onSuccess: (playlistId: string) => {
      videoRemovedHotjarEvent();
      // Needed to be able to deactivate the FocusTrap before moving the focus
      // upon removing a video from the playlist this button is rendered inside
      if (onCleanup) {
        onCleanup(playlistId, () => setIsOpen(false));
      }
    },
    onError: checkPlaylistForVideo,
  });

  const { mutate: mutateAddToPlaylist } = useAddToPlaylistMutation({
    onSuccess: videoAddedHotjarEvent,
    onError: uncheckPlaylistForVideo,
  });

  React.useEffect(() => {
    if (playlists && videoId) {
      const ids = playlists
        .filter((playlist) =>
          playlist.assets.map((v) => v.id).includes(videoId),
        )
        .map((playlist) => playlist.id);

      setPlaylistsContainingVideo(ids);
    }
  }, [playlists, videoId]);

  const onCheckboxChange = (e) => {
    const playlistId = e.target.id;
    const chosenPlaylist = playlists.filter(
      (playlist) => playlist.id === playlistId,
    )[0];

    if (playlistsContainingVideo.includes(playlistId)) {
      uncheckPlaylistForVideo(playlistId);
      mutateRemoveFromPlaylist({
        playlist: chosenPlaylist,
        videoId,
      });
    } else {
      checkPlaylistForVideo(playlistId);
      mutateAddToPlaylist({
        playlist: chosenPlaylist,
        videoId,
      });
    }
  };

  const handlePlaylistCreationError = (playlistName: string) => {
    displayNotification(
      'error',
      `Error: Failed to create playlist ${playlistName}`,
      'Please try again',
      `create-playlist-${playlistName}-failed`,
    );
  };

  const handlePlaylistCreationSuccess = (_, playlistName: string) => {
    setShowCreatePlaylistModal(false);
    setIsOpen(false);
    displayNotification(
      'success',
      `Playlist "${playlistName}" created`,
      '',
      `create-${playlistName}-playlist`,
    );
    displayNotification(
      'success',
      `Video added to "${playlistName}"`,
      '',
      `add-video-to-${playlistName}-playlist`,
    );
    videoAddedHotjarEvent();
    playlistCreatedHotjarEvent();
  };

  const videoNotAddedToAnyPlaylist = playlistsContainingVideo.length === 0;
  const buttonDescription = videoNotAddedToAnyPlaylist
    ? 'Add to playlist'
    : 'Add or remove from playlist';

  const hasPlaylists = !isLoading && playlists && playlists.length > 0;

  return (
    <div
      id={videoId}
      className={c(s.addToPlaylist, { [s.buttonActive]: isOpen })}
    >
      {showCreatePlaylistModal && (
        <div className={s.createPlaylistModalWrapper}>
          <CreatePlaylistModal
            videoId={videoId}
            onCancel={() => setShowCreatePlaylistModal(false)}
            onSuccess={handlePlaylistCreationSuccess}
            onError={handlePlaylistCreationError}
          />
        </div>
      )}

      <Tooltip text={buttonDescription}>
        <Button
          text={buttonDescription}
          aria-label={buttonDescription}
          iconOnly
          icon={
            videoNotAddedToAnyPlaylist ? (
              <PlaylistAddIcon className={s.addSvg} />
            ) : (
              <PlaylistAddAlreadyAddedIcon className={s.removeSvg} />
            )
          }
          onClick={() => {
            if (onClick) {
              onClick();
            }
            setIsOpen(!isOpen);
          }}
          type="outline"
          width="40px"
          height="40px"
        />
      </Tooltip>
      {isOpen && !showCreatePlaylistModal && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: hasPlaylists
              ? `input[id='${playlists[0].id}']`
              : '#create-new-playlist-button',
          }}
          active={isOpen}
        >
          {/* Below should be fine according to https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/479 */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            ref={ref}
            role="dialog"
            className={s.playlistPanel}
            data-qa="add-to-playlist-pop-up"
            onKeyDown={(event) =>
              handleEscapeKeyEvent(event, () => setIsOpen(false))
            }
          >
            <div className={s.header}>
              <Typography.Body weight="medium">Add to playlist</Typography.Body>
              <button
                type="button"
                aria-label="close add to playlist"
                onClick={() => setIsOpen(false)}
              >
                <CloseButton />
              </button>
            </div>
            <ul className={s.content}>
              {hasPlaylists ? (
                playlists.map((playlist: Collection) => {
                  const isSelected = playlistsContainingVideo.includes(
                    playlist.id,
                  );
                  return (
                    <li key={playlist.id}>
                      <BoCheckbox
                        onChange={onCheckboxChange}
                        name={playlist.title}
                        id={playlist.id}
                        checked={isSelected}
                      />
                    </li>
                  );
                })
              ) : isLoading ? (
                <li>
                  <LoadingOutlined className="mr-2" />
                  Loading playlists...
                </li>
              ) : (
                <li>You have no playlists yet</li>
              )}
            </ul>
            <div>
              <Button
                onClick={() => setShowCreatePlaylistModal(true)}
                text="Create new playlist"
                type="label"
                id="create-new-playlist-button"
                icon={<PlusIcon />}
              />
            </div>
          </div>
        </FocusTrap>
      )}
    </div>
  );
};
