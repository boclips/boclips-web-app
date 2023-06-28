import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Badge from '@boclips-ui/badge';
import s from './style.module.less';

interface Props {
  video: Video;
}

const licenseDurationInfo = (maxDuration: number) => {
  if (maxDuration >= 10) return 'Can be licensed for 10+ years';

  return maxDuration === 1
    ? `Can be licensed for a maximum of 1 year`
    : `Can be licensed for a maximum of ${maxDuration} years`;
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
