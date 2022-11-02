import React from 'react';

import { DownloadOutlined } from '@ant-design/icons/lib';
import debounce from 'lodash/debounce';
import './DownloadVideoButton.less';
import { VideoAssetsService } from 'src/services/videoAssets/VideoAssetsService';

interface Props {
  downloadUrl: string;
}

const DownloadVideoAssetsButton = ({ downloadUrl }: Props) => {
  const getVideo = () => {
    VideoAssetsService.downlaodVideoAsset(downloadUrl);
  };

  return (
    <button
      className="asset-button"
      type="button"
      onClick={debounce(() => getVideo(), 500)}
    >
      <DownloadOutlined /> Download video
    </button>
  );
};

export default DownloadVideoAssetsButton;
