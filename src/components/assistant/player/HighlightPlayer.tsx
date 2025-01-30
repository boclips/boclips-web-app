import React from 'react';
import Feedback from 'src/components/assistant/feedback/Feedback';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import expandUrlTemplate from 'boclips-api-client/dist/sub-clients/common/utils/expandUrlTemplate';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import s from './style.module.less';

interface Props {
  clip: Clip;
}

const HighlightPlayer = ({ clip }: Props) => {
  const videoLink = useBoclipsClient().links.video;

  return (
    <div className={s.playerWrapper}>
      <VideoPlayer
        videoLink={
          new Link({
            href: expandUrlTemplate(videoLink.href, {
              id: clip.videoId,
            }),
            templated: false,
          })
        }
        segment={{ start: clip.startTime, end: clip.endTime }}
      />
      <div className={s.buttonWrapper}>
        <div className={s.actionbuttons} />
        <Feedback clipId={clip.clipId} />
      </div>
    </div>
  );
};

export default HighlightPlayer;
