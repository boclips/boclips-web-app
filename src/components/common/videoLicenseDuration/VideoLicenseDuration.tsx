import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Badge from '@boclips-ui/badge';
import { getVideoOrderLicenseDurationLabel } from 'src/services/getVideoLicenseDurationLabel';
import s from './style.module.less';

interface Props {
  video: Video;
}

const VideoLicenseDuration = ({ video }: Props) => {
  return (
    <Badge
      customClassName={s.licenseDuration}
      data-qa="video-license-duration-badge"
      label={getVideoOrderLicenseDurationLabel(video.maxLicenseDurationYears)}
    />
  );
};

export default VideoLicenseDuration;
