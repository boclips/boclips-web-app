import { Video } from 'boclips-api-client/dist/types';
import c from 'classnames';
import { Typography } from 'boclips-ui';
import React from 'react';
import s from './style.module.less';

interface Props {
  video: Video;
}

const VideoDescription = ({ video }: Props) => {
  return (
    video.description.trim() && (
      <section className={c(s.scrollableDescription, s.descriptionSection)}>
        <Typography.H1 size="xs" weight="medium" className="text-gray-900">
          Video Description
        </Typography.H1>
        <Typography.Body as="p" size="small" className="text-gray-800">
          {video.description}
        </Typography.Body>

        <Typography.Body className="lg:mt-4 text-gray-800">
          {video.additionalDescription}
        </Typography.Body>
      </section>
    )
  );
};

export default VideoDescription;
