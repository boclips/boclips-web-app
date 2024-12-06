import { Typography } from 'boclips-ui';
import React from 'react';
import { VideoAIMetadata } from '@components/videoPage/videoMetadata/types/VideoAIMetadata';
import s from '../style.module.less';

interface Props {
  metadata: string[];
  type: VideoAIMetadata;
}
export const VideoAIMetadataContent = ({ metadata, type }: Props) => (
  <ul className={s.outcomeList}>
    {metadata.map((elem: string, index) => (
      <Typography.Body
        key={`${type} ${index}`}
        as="li"
        size="small"
        className="text-gray-800"
      >
        {elem}
      </Typography.Body>
    ))}
  </ul>
);
