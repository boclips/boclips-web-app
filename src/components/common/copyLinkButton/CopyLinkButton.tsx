import React from 'react';
import CopyLinkIcon from 'src/resources/icons/copy-link-icon.svg';
import CopiedLinkIcon from 'src/resources/icons/copied-link-icon.svg';
import Button from '@boclips-ui/button';
import Tooltip from '@boclips-ui/tooltip';
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
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedToClipboard(true);

      if (onCopy) {
        onCopy();
      }
    });

    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 1500);
  };

  return (
    <div className={s.copyLinkButton}>
      <Tooltip text={copiedToClipboard ? 'Copied' : ariaLabel}>
        <Button
          aria-label={copiedToClipboard ? 'Copied' : ariaLabel}
          data-qa={dataQa}
          onClick={handleClick}
          type="outline"
          icon={copiedToClipboard ? <CopiedLinkIcon /> : <CopyLinkIcon />}
          disabled={disabled}
          width="40px"
          height="40px"
          iconOnly
          role={copiedToClipboard ? 'alert' : 'button'}
        />
      </Tooltip>
    </div>
  );
};
