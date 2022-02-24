import React from 'react';
import c from 'classnames';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  description: string;
}

const PlaylistDescription = ({ description }: Props) => {
  return (
    <div className={c(s.description, 'md:order-last sm:order-2')}>
      <Typography.Body>{description}</Typography.Body>
    </div>
  );
};

export default PlaylistDescription;
