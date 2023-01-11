import React from 'react';
import Button from '@boclips-ui/button';
import ShareIcon from 'src/resources/icons/share.svg';
import c from 'classnames';
import s from '../style.module.less';

interface Props {
  handleClick: () => void;
}

export const OwnOrEditablePlaylistShareButton = ({ handleClick }: Props) => {
  return (
    <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
      <Button
        dataQa="share-editable-playlist-button"
        onClick={handleClick}
        icon={<ShareIcon />}
        type="outline"
        text="Share"
      />
    </div>
  );
};
