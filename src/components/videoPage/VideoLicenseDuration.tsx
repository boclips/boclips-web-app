import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Badge from '@boclips-ui/badge';
import s from './style.module.less';

interface Props {
  video: Video;
}

const licenseDurationInfo = (maxDuration: number) => {
  return maxDuration < 10
    ? `Can be licensed for a maximum of ${maxDuration} years`
    : 'Can be licensed for 10+ years';
};

const VideoLicenseDuration = ({ video }: Props) => {
  return video.maxLicenseDurationYears ? (
    <Badge
      customClassName={s.licenseDuration}
      label={licenseDurationInfo(video.maxLicenseDurationYears)}
    />
  ) : null;
};

export default VideoLicenseDuration;
