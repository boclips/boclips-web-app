import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import s from '@components/playlists/playlistHeader/style.module.less';
import { Typography } from 'boclips-ui';

interface Props {
  text: string;
  label: string;
  icon: React.ReactElement;
  onSelect: () => void;
}

export const OptionItem = ({ text, label, icon, onSelect }: Props) => (
  <DropdownMenu.Item
    className={s.optionsItem}
    textValue={label}
    onSelect={onSelect}
  >
    {icon}
    <Typography.Body as="span" weight="medium">
      {text}
    </Typography.Body>
  </DropdownMenu.Item>
);
