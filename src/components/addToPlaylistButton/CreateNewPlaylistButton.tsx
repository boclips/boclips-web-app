import React, { ReactElement, useState } from 'react';
import Button from '@boclips-ui/button';
import { BoInputText } from 'src/components/common/input/BoInputText';
import s from 'src/components/addToPlaylistButton/style.module.less';
import { LoadingOutlined } from '@ant-design/icons';
import PlusIcon from '../../resources/icons/plus-sign.svg';

interface Props {
  isLoading?: boolean;
  onCreate: (string) => void;
}

export const CreateNewPlaylistButton = ({
  isLoading = false,
  onCreate,
}: Props) => {
  const [showAddPlaylistInput, setShowAddPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

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
          onClick={() => onCreate(newPlaylistName)}
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
