import Tooltip from '@boclips-ui/tooltip';
import Button from '@boclips-ui/button';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import PlaylistAddAlreadyAddedIcon from 'src/resources/icons/playlist-add-already-added.svg';
import React, { useRef, useState } from 'react';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import {
  doAddToPlaylist,
  doRemoveFromPlaylist,
  usePlaylistsQuery,
} from 'src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import c from 'classnames';
import { useMutation } from 'react-query';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import s from './style.module.less';

interface Props {
  videoId: string;
}

interface UpdatePlaylistProps {
  playlist: Collection;
  vidId: string;
}

export const AddToPlaylistButton = ({ videoId }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [playlistsContainingVideo, setPlaylistsContainingVideo] = useState<
    string[]
  >([]);

  const ref = useRef(null);

  CloseOnClickOutside(ref, setIsOpen);

  const { data: playlists } = usePlaylistsQuery();

  const uncheckPlaylistForVideo = (playlistId: string) =>
    setPlaylistsContainingVideo((prevState) =>
      prevState.filter((plId) => plId !== playlistId),
    );

  const checkPlaylistForVideo = (playlistId: string) =>
    setPlaylistsContainingVideo((prevState) => [...prevState, playlistId]);

  const { mutate: mutateAddToPlaylist } = useMutation(
    async ({ playlist, vidId }: UpdatePlaylistProps) =>
      doAddToPlaylist(playlist, vidId),
    {
      onSuccess: (_, { playlist, vidId }) => {
        displayNotification(
          'success',
          `add-video-${vidId}-to-playlist`,
          `Video saved to "${playlist.title}"`,
          '',
        );
      },
      onError: (_, { playlist, vidId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `add-video-${vidId}-to-playlist`,
          'Error: Failed to add video to playlist',
          'Please refresh the page and try again',
        );
        uncheckPlaylistForVideo(playlist.id);
      },
    },
  );

  const { mutate: mutateRemoveFromPlaylist } = useMutation(
    async ({ playlist, vidId }: UpdatePlaylistProps) =>
      doRemoveFromPlaylist(playlist, vidId),
    {
      onSuccess: (_, { playlist, vidId }) => {
        displayNotification(
          'success',
          `remove-video-${vidId}-from-playlist`,
          `Video removed from "${playlist.title}"`,
        );
      },
      onError: (_, { playlist, vidId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `remove-video-${vidId}-from-playlist`,
          'Error: Failed to remove video from playlist',
          'Please refresh the page and try again',
        );
        checkPlaylistForVideo(playlist.id);
      },
    },
  );

  React.useEffect(() => {
    const playlistsTemp =
      playlists
        ?.filter((playlist) =>
          playlist.videos.map((v) => v.id).includes(videoId),
        )
        .map((playlist) => playlist.id) || [];
    setPlaylistsContainingVideo(playlistsTemp);
  }, [playlists, videoId]);

  const onCheckboxChange = (e) => {
    const playlistId = e.target.id;
    const chosenPlaylist = playlists.filter(
      (playlist) => playlist.id === playlistId,
    )[0];

    if (playlistsContainingVideo.includes(playlistId)) {
      uncheckPlaylistForVideo(playlistId);
      mutateRemoveFromPlaylist({ playlist: chosenPlaylist, vidId: videoId });
    } else {
      checkPlaylistForVideo(playlistId);
      mutateAddToPlaylist({ playlist: chosenPlaylist, vidId: videoId });
    }
  };

  return (
    <div id={videoId} className={s.addToPlaylist}>
      <Tooltip text="Add to playlist">
        <Button
          text="Add to playlist"
          aria-label="Add to playlist"
          iconOnly
          icon={
            playlistsContainingVideo.length === 0 ? (
              <PlaylistAddIcon />
            ) : (
              <PlaylistAddAlreadyAddedIcon />
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
      {isOpen && (
        <div ref={ref} className={s.popover}>
          <div className={s.popoverHeader}>
            <h5>Add to playlist</h5>
            <button
              type="button"
              aria-label="close add to playlist"
              onClick={() => setIsOpen(false)}
            >
              <CloseButton />
            </button>
          </div>
          <ul className={s.popoverContent}>
            {playlists?.length > 0 ? (
              playlists.map((playlist: Collection) => {
                const isSelected = playlistsContainingVideo.includes(
                  playlist.id,
                );
                return (
                  <li key={playlist.id}>
                    <label htmlFor={playlist.id}>
                      <input
                        onChange={onCheckboxChange}
                        type="checkbox"
                        className={s.checkbox}
                        name={playlist.title}
                        id={playlist.id}
                        checked={isSelected}
                      />
                      <span className={c({ 'font-medium': isSelected })}>
                        {playlist.title}
                      </span>
                    </label>
                  </li>
                );
              })
            ) : (
              <li>You have no playlists yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
