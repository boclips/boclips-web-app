import Button from '@boclips-ui/button';
import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  onClick: () => void;
  text: string;
  className?: string;
  icon?: React.ReactElement;
  ariaLabel?: string;
}

export const TextButton = ({
  onClick,
  text,
  className,
  icon,
  ariaLabel,
}: Props) => (
  <div className={c(s.textButton, { [className]: className })}>
    <Button ariaLabel={ariaLabel} onClick={onClick} text={text} icon={icon} />
  </div>
);
