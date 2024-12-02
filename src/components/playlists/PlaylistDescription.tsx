import React from 'react';
import c from 'classnames';
import { Typography } from 'boclips-ui';
import s from './style.module.less';

interface Props {
  description: string;
}

const PlaylistDescription = ({ description }: Props) => {
  return (
    <div className={c(s.description, 'md:order-last sm:order-2')}>
      <Typography.Body data-qa="playlistDescription" className="text-gray-900">
        {description}
      </Typography.Body>
    </div>
  );
};

export default PlaylistDescription;
