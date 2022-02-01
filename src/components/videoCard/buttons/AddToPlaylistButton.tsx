import { Tooltip } from '@boclips-ui/tooltip';
import Button from '@boclips-ui/button';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import PlaylistAddAlreadyAddedIcon from 'src/resources/icons/playlist-add-already-added.svg';
import React, { useState } from 'react';
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
import s from './style.module.less';

interface Props {
  videoId: string;
}

interface UpdatePlaylistProps {
  playlist: Collection;
  vidId: string;
}

export const AddToPlaylistButton = ({ videoId }: Props) => {
  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState<boolean>(
    false,
  );

  const [playlistsContainingVideo, setPlaylistsContainingVideo] = useState<
    string[]
  >([]);

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
    <div className={s.addToPlaylist}>
      <Tooltip text="Add to playlist">
        <span>
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
              setIsAddToPlaylistVisible(!isAddToPlaylistVisible);
            }}
            type="outline"
            width="40px"
            height="40px"
          />
        </span>
      </Tooltip>
      {isAddToPlaylistVisible && (
        <div className={s.popover}>
          <div className={s.popoverHeader}>
            <div>Add to playlist</div>
            <button
              type="button"
              aria-label="close add to playlist"
              onClick={() => setIsAddToPlaylistVisible(false)}
            >
              <CloseButton />
            </button>
          </div>
          <ul className={s.popoverContent}>
            {playlists?.map((playlist: Collection) => {
              const isSelected = playlistsContainingVideo.includes(playlist.id);
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
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
