import React, { useState } from 'react';
import Button from '@boclips-ui/button';
import ShareIcon from '@src/resources/icons/share.svg';
import c from 'classnames';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { EditPlaylistPermissionsModal } from '@src/components/playlistModal/EditPlaylistPermissionsModal';
import s from '../style.module.less';

interface Props {
  playlist: Collection;
  handleClick: () => void;
}

export const OwnOrEditablePlaylistShareButton = ({
  playlist,
  handleClick,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenPermissionsModal = () => {
    setIsModalOpen(true);
  };

  const handleClosePermissionsModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
        <Button
          dataQa="share-editable-playlist-button"
          onClick={playlist.mine ? handleOpenPermissionsModal : handleClick}
          icon={<ShareIcon />}
          type="outline"
          text="Share"
        />
      </div>
      {isModalOpen && (
        <EditPlaylistPermissionsModal
          playlist={playlist}
          handleClick={handleClick}
          onCancel={handleClosePermissionsModal}
        />
      )}
    </>
  );
};
