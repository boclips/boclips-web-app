import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { VideoInfo } from '@src/components/common/videoInfo/VideoInfo';
import { VideoBadges } from '@src/components/videoPage/VideoBadges';
import { DownloadTranscriptButton } from '@src/components/downloadTranscriptButton/DownloadTranscriptButton';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import s from './style.module.less';

interface Props {
  video?: Video;
}

export const UnauthorizedVideoHeader = ({ video }: Props) => {
  if (!video) {
    return null;
  }

  const videoHasTranscript = video?.links?.transcript;

  return (
    <>
      <div className={s.sticky}>
        <div className="flex justify-between">
          <Typography.H1 size="md" className="text-gray-900 " id="video-title">
            {video?.title}
          </Typography.H1>
        </div>
        <VideoInfo video={video} />
      </div>

      <div className={s.descriptionAndButtons}>
        <div>
          <VideoBadges video={video} />
        </div>
        <div className={(s.sticky, s.buttons)}>
          <div className={s.buttonsGroup}>
            {videoHasTranscript && <DownloadTranscriptButton video={video} />}
          </div>
        </div>
      </div>
    </>
  );
};
