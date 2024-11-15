import ReleasedOn from '@boclips-ui/released-on';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import getFormattedDuration from '@src/services/getFormattedDuration';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoInfo = ({ video }: Props) => {
  return (
    <div className={`lg:mb-2 ${s.videoInfo}`}>
      <ReleasedOn releasedOn={video?.releasedOn} />

      <Typography.Body as="div" size="small">
        {video?.id}
      </Typography.Body>

      {video.playback.duration && (
        <Typography.Body as="div" size="small" data-qa="duration">
          {getFormattedDuration(video.playback.duration)}
        </Typography.Body>
      )}

      <Typography.Body as="div" className={s.createdBy} size="small">
        {video?.createdBy}
      </Typography.Body>
    </div>
  );
};
