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
  usePlaylistMutation,
} from 'src/hooks/api/playlistsQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import c from 'classnames';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import { CreateNewPlaylistButton } from 'src/components/addToPlaylistButton/CreateNewPlaylistButton';
import s from './style.module.less';

interface Props {
  videoId: string;
}

export const AddToPlaylistButton = ({ videoId }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const { mutate: onSaveNewPlaylist } = usePlaylistMutation();
  const handleNewPlaylistRequest = (name: string) => {
    onSaveNewPlaylist({
      title: name,
      origin: 'BO_WEB_APP',
      videos: [videoId],
      description: '',
    });
  };

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

  return (
    <div
      id={videoId}
      className={c(s.addToPlaylist, { [s.buttonActive]: isOpen })}
    >
      <Tooltip text="Add to playlist">
        <Button
          text="Add to playlist"
          aria-label="Add to playlist"
          iconOnly
          icon={
            playlistsContainingVideo.length === 0 ? (
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
      {isOpen && (
        <div ref={ref} className={s.playlistPanel}>
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
          <CreateNewPlaylistButton onCreate={handleNewPlaylistRequest} />
        </div>
      )}
    </div>
  );
};
