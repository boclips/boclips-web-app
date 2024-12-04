import React from 'react';
import CopyLinkIcon from '@src/resources/icons/copy-link-icon.svg';
import { Button, Tooltip } from 'boclips-ui';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import s from './style.module.less';

interface Props {
  onCopy?: () => void;
  textToCopy: string;
  disabled?: boolean;
  dataQa?: string;
  ariaLabel: string;
}

export const CopyButton = ({
  onCopy,
  textToCopy,
  disabled,
  dataQa,
  ariaLabel,
}: Props) => {
  const handleClick = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (onCopy) {
        onCopy();
      }

      displayNotification('success', 'Copied!', '', 'text-copied-notification');
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
