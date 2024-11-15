import React from 'react';
import Button from '@boclips-ui/button';
import CopyLinkIcon from '@src/resources/icons/copy-link-icon.svg';
import c from 'classnames';
import s from '../style.module.less';

interface Props {
  handleClick: () => void;
}

export const ViewOnlyPlaylistShareButton = ({ handleClick }: Props) => {
  return (
    <div className={c(s.playlistButton, 'md:order-2 sm:order-last')}>
      <Button
        dataQa="share-view-only-playlist-button"
        onClick={handleClick}
        icon={<CopyLinkIcon />}
        type="outline"
        text="Get view-only link"
      />
    </div>
  );
};
