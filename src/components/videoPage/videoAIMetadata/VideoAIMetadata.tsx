import { LoadingOutlined } from '@ant-design/icons';
import Badge from '@boclips-ui/badge';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { VideoAIMetadataContent } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataContent';
import { VideoAIMetadataType } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataType';
import s from './videoAIMetadata.module.less';

interface Props {
  isLoading: boolean;
  metadata: string[];
  type: VideoAIMetadataType;
}
export const VideoAIMetadata = ({ isLoading, metadata, type }: Props) => {
  const getAIBadge = () =>
    isLoading ? (
      <LoadingOutlined className={s.spinner} />
    ) : (
      <Badge value="AI generated" />
    );

  return (
    <div className={s.videoAIContent}>
      <div className="flex flex-row items-center">
        <Typography.Title1 className="mr-2">{type}</Typography.Title1>
        {getAIBadge()}
      </div>
      {!isLoading && metadata && (
        <VideoAIMetadataContent metadata={metadata} type={type} />
      )}
    </div>
  );
};
