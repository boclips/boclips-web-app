import Tooltip from '@boclips-ui/tooltip';
import Button from '@boclips-ui/button';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import PlaylistAddAlreadyAddedIcon from 'src/resources/icons/playlist-add-already-added.svg';
import React, { useRef, useState } from 'react';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import {
  useAddToPlaylistMutation,
  useRemoveFromPlaylistMutation,
  useOwnPlaylistsQuery,
} from 'src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import c from 'classnames';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import FocusTrap from 'focus-trap-react';
import { handleEscapeKeyEvent } from 'src/services/handleKeyEvent';
import { CreatePlaylistBodal } from 'src/components/createPlaylistModal/createPlaylistBodal';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import PlusIcon from 'src/resources/icons/plus-sign.svg';
import s from './style.module.less';

interface Props {
  videoId: string;
}

export const AddToPlaylistButton = ({ videoId }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] =
    useState<boolean>(false);

  const [playlistsContainingVideo, setPlaylistsContainingVideo] = useState<
    string[]
  >([]);

  const ref = useRef(null);

  CloseOnClickOutside(ref, setIsOpen);

  const { data: playlists } = useOwnPlaylistsQuery();

  const uncheckPlaylistForVideo = (id: string) =>
    setPlaylistsContainingVideo((prevState) =>
      prevState.filter((plId) => plId !== id),
    );

  const checkPlaylistForVideo = (id: string) =>
    setPlaylistsContainingVideo((prevState) => [...prevState, id]);

  const { mutate: mutateRemoveFromPlaylist } = useRemoveFromPlaylistMutation(
    (id) => checkPlaylistForVideo(id),
  );

  const { mutate: mutateAddToPlaylist } = useAddToPlaylistMutation((id) =>
    uncheckPlaylistForVideo(id),
  );

  React.useEffect(() => {
    if (playlists && videoId) {
      const ids = playlists
        .filter((playlist) =>
          playlist.videos.map((v) => v.id).includes(videoId),
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
      mutateRemoveFromPlaylist({ playlist: chosenPlaylist, videoId });
    } else {
      checkPlaylistForVideo(playlistId);
      mutateAddToPlaylist({ playlist: chosenPlaylist, videoId });
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

  const handlePlaylistCreationSuccess = (_: string, playlistName: string) => {
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
  };

  const videoNotAddedToAnyPlaylist = playlistsContainingVideo.length === 0;
  const buttonDescription = videoNotAddedToAnyPlaylist
    ? 'Add to playlist'
    : 'Add or remove from playlist';
  return (
    <div
      id={videoId}
      className={c(s.addToPlaylist, { [s.buttonActive]: isOpen })}
    >
      {showCreatePlaylistModal && (
        <div className={s.createPlaylistModalWrapper}>
          <CreatePlaylistBodal
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
            setIsOpen(!isOpen);
          }}
          type="outline"
          width="40px"
          height="40px"
        />
      </Tooltip>
      {isOpen && !showCreatePlaylistModal && (
        <FocusTrap>
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
              <h5>Add to playlist</h5>
              <button
                type="button"
                aria-label="close add to playlist"
                onClick={() => setIsOpen(false)}
              >
                <CloseButton />
              </button>
            </div>
            <ul className={s.content}>
              {playlists?.length > 0 ? (
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
              ) : (
                <li>You have no playlists yet</li>
              )}
            </ul>
            <div>
              <Button
                onClick={() => setShowCreatePlaylistModal(true)}
                text="Create new playlist"
                type="label"
                icon={<PlusIcon />}
              />
            </div>
          </div>
        </FocusTrap>
      )}
    </div>
  );
};
