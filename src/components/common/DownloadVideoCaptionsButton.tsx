import React from 'react';

import { DownloadOutlined } from '@ant-design/icons/lib';
import debounce from 'lodash/debounce';
import { VideoAssetsService } from 'src/services/videoAssets/VideoAssetsService';
import Button from '@boclips-ui/button';
import s from './DownloadVideoCaptionsButton.module.less'

interface Props {
  videoTitle: string;
  downloadUrl: string;
}

const DownloadVideoCaptionsButton = ({ videoTitle, downloadUrl }: Props) => {
  const getCaptions = () => {
    VideoAssetsService.downloadCaptionsAsset(videoTitle, downloadUrl);
  };

  return (
    <Button
      className={s.downloadCaptions}

      onClick={debounce(() => getCaptions(), 500)}
      width="211px"
      text="Download captions"
      height="48px"
      icon={<DownloadOutlined />}
    />
  );
};

export default DownloadVideoCaptionsButton;
