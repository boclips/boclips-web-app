import { LoadingOutlined } from '@ant-design/icons';
import Badge from '@boclips-ui/badge';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { VideoAIMetadataContent } from 'src/components/videoPage/videoMetadata/ai/VideoAIMetadataContent';
import { VideoAIMetadata } from 'src/components/videoPage/videoMetadata/types/VideoAIMetadata';
import s from '../style.module.less';

interface Props {
  isLoading: boolean;
  metadata: string[];
  type: VideoAIMetadata;
}

const AiMetadata = ({ isLoading, metadata, type }: Props) => {
  const getAIBadge = () =>
    isLoading ? (
      <LoadingOutlined
        data-qa="video-ai-metadata-loading-spinner"
        className={s.spinner}
      />
    ) : (
      <Badge value="AI generated" />
    );

  const showContent = () =>
    metadata ? (
      <VideoAIMetadataContent metadata={metadata} type={type} />
    ) : (
      <Typography.Body as="p" size="small" className="text-gray-800">
        There are no {type} available for this video yet.
      </Typography.Body>
    );

  return (
    <>
      <div className="flex flex-row items-center">
        <Typography.H1 size="xs" weight="medium" className="text-gray-900 mr-2">
          {type}
        </Typography.H1>
        {getAIBadge()}
      </div>
      {!isLoading && showContent()}
    </>
  );
};

export default AiMetadata;
