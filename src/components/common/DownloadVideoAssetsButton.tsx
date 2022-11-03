import React from 'react';

import { DownloadOutlined } from '@ant-design/icons/lib';
import debounce from 'lodash/debounce';
import './DownloadVideoButton.less';
import { VideoAssetsService } from 'src/services/videoAssets/VideoAssetsService';
import Button from '@boclips-ui/button';

interface Props {
  downloadUrl: string;
  additionalOnClick?: () => void;
}

const DownloadVideoAssetsButton = ({ downloadUrl, additionalOnClick }: Props) => {
  const getVideo = () => {
    VideoAssetsService.downlaodVideoAsset(downloadUrl);
    if (additionalOnClick !== null) {
      additionalOnClick()
    }
  };

  return (
    <Button
      className="asset-button"
      onClick={debounce(() => getVideo(), 500)}
      width="185px"
      text="Download video"
      height="48px"
      icon={<DownloadOutlined />}
    />
  );
};

export default DownloadVideoAssetsButton;
