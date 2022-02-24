import React, { useState } from 'react';
import Button from '@boclips-ui/button';
import { BoInputText } from 'src/components/common/input/BoInputText';
import s from 'src/components/addToPlaylistButton/style.module.less';
import PlusIcon from '../../resources/icons/plus-sign.svg';

interface Props {
  onCreate: (string) => void;
}

export const CreateNewPlaylistButton = ({ onCreate }: Props) => {
  const [showAddPlaylistInput, setShowAddPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

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
        <Button onClick={() => onCreate(newPlaylistName)} text="Create" />
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
