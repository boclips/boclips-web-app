import Button from '@boclips-ui/button';
import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  onClick: () => void;
  text: string;
  icon?: React.ReactElement;
}

export const TextButton = ({ onClick, text, icon }: Props) => (
  <div className={c(s.textButton)}>
    <Button onClick={onClick} text={text} icon={icon} />
  </div>
);
