import React from 'react';
import ShareSVG from 'src/resources/icons/white-share.svg';
import Button from '@boclips-ui/button';
import s from './shareButton.module.less';

interface VideoShareButtonProps {
  iconOnly?: boolean;
}

export const VideoShareButton = ({
  iconOnly = false,
}: VideoShareButtonProps) => {
  return (
    <Button
      onClick={() => {}}
      dataQa="share-button"
      text="Share"
      aria-label="Share"
      icon={<ShareSVG />}
      height="40px"
      className={s.shareButton}
      iconOnly={iconOnly}
    />
  );
};
