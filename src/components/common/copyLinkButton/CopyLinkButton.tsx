import React from 'react';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import Button from '@boclips-ui/button';
import Tooltip from '@boclips-ui/tooltip';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import s from './style.module.less';

interface Props {
  onCopy?: () => void;
  link: string;
  disabled?: boolean;
  dataQa?: string;
  ariaLabel: string;
}

export const CopyLinkButton = ({
  onCopy,
  link,
  disabled,
  dataQa,
  ariaLabel,
}: Props) => {
  const handleClick = () => {
    navigator.clipboard.writeText(link).then(() => {
      if (onCopy) {
        onCopy();
      }

      displayNotification(
        'success',
        'Link copied!',
        '',
        'video-link-copied-notification',
      );
    });
  };

  return (
    <div className={s.copyLinkButton}>
      <Tooltip text={ariaLabel}>
        <Button
          aria-label={ariaLabel}
          data-qa={dataQa}
          onClick={handleClick}
          type="outline"
          icon={<CopyLinkIcon />}
          disabled={disabled}
          width="40px"
          height="40px"
          iconOnly
        />
      </Tooltip>
    </div>
  );
};
