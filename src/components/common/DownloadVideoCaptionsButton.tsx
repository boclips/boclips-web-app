import React from 'react';

import { DownloadOutlined } from '@ant-design/icons/lib';
import debounce from 'lodash/debounce';
import { VideoAssetsService } from 'src/services/videoAssets/VideoAssetsService';

interface Props {
  videoTitle: string;
  downloadUrl: string;
}

const DownloadVideoCaptionsButton = ({ videoTitle, downloadUrl }: Props) => {
  const getCaptions = () => {
    VideoAssetsService.downloadCaptionsAsset(videoTitle, downloadUrl);
  };

  return (
    <button
      className="asset-button"
      type="button"
      onClick={debounce(() => getCaptions(), 500)}
    >
      <DownloadOutlined /> Download captions
    </button>
  );
};

export default DownloadVideoCaptionsButton;
