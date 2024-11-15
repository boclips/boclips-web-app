import React, { useEffect, useState } from 'react';
import Button from '@boclips-ui/button';
import { Video } from 'boclips-api-client/dist/types';
import PencilSVG from '@src/resources/icons/pencil.svg';
import {
  useEditPlaylistMutation,
  usePlaylistQuery,
} from '@src/hooks/api/playlistsQuery';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';
import NoteModal from '@src/components/playlists/buttons/playlistNote/noteModal/NoteModal';
import { Notes } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
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
  const [notes, setNotes] = useState<Notes>();
  const hasNotes = !!notes && !!notes[video.id];
  useEffect(() => {
    if (!playlist) return;
    setNotes(
      playlist.assets.reduce((accum, asset) => {
        if (asset.note) {
          accum[asset.id] = asset.note;
        }
        return accum;
      }, {}),
    );
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

  const onConfirm = (videoId: string, note: string) => {
    notes[videoId] = note;

    updatePlaylist(
      { notes },
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
          initialNote={(hasNotes && notes[video.id]) || ''}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

export default PlaylistVideoNoteButton;
