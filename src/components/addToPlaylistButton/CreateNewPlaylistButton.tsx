import React, { ReactElement, useState } from 'react';
import Button from '@boclips-ui/button';
import { BoInputText } from 'src/components/common/input/BoInputText';
import s from 'src/components/addToPlaylistButton/style.module.less';
import { LoadingOutlined } from '@ant-design/icons';
import { usePlaylistMutation } from 'src/hooks/api/playlistsQuery';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import PlusIcon from '../../resources/icons/plus-sign.svg';

interface Props {
  videoId: string;
}

export const CreateNewPlaylistButton = ({ videoId }: Props) => {
  const [showAddPlaylistInput, setShowAddPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const {
    mutate: onSaveNewPlaylist,
    isSuccess,
    isLoading,
  } = usePlaylistMutation();

  React.useEffect(() => {
    if (isSuccess) {
      setShowAddPlaylistInput(false);
      displayNotification(
        'success',
        `Video added to "${newPlaylistName}"`,
        '',
        `add-video-${videoId}-to-playlist`,
      );
    }
  }, [isSuccess]);

  const handleNewPlaylistRequest = (name: string) => {
    onSaveNewPlaylist({
      title: name,
      origin: 'BO_WEB_APP',
      videos: [videoId],
      description: '',
    });
  };

  const getSpinner = (): ReactElement =>
    isLoading && (
      <span data-qa="spinner" className="pb-2 spinner">
        <LoadingOutlined />
      </span>
    );

  const playlistForm = () => (
    <div className={s.createPlaylistForm}>
      <BoInputText
        placeholder="Add playlist name"
        inputType="text"
        label=""
        constraints={{ required: true }}
        onChange={(name) => setNewPlaylistName(name)}
      />
      {newPlaylistName.length > 0 && (
        <Button
          disabled={isLoading}
          onClick={() => handleNewPlaylistRequest(newPlaylistName)}
          icon={getSpinner()}
          text="Create"
        />
      )}
    </div>
  );
  return (
    <div>
      {showAddPlaylistInput ? (
        playlistForm()
      ) : (
        <Button
          onClick={() => setShowAddPlaylistInput(true)}
          text="Create new playlist"
          type="label"
          icon={<PlusIcon />}
        />
      )}
    </div>
  );
};
