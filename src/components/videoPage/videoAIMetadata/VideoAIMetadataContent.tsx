import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { VideoAIMetadataType } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataType';
import s from './videoAIMetadata.module.less';

interface Props {
  metadata: string[];
  type: VideoAIMetadataType;
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
