import React from 'react';
import Feedback from 'src/components/assistant/feedback/Feedback';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import expandUrlTemplate from 'boclips-api-client/dist/sub-clients/common/utils/expandUrlTemplate';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import FilmIcon from 'src/resources/icons/film-icon.svg';
import formatDuration from 'src/components/playlists/buttons/playlistBookmark/helpers/formatDuration';
import s from './style.module.less';

interface Props {
  clip: Clip;
}

const HighlightPlayer = ({ clip }: Props) => {
  const videoLink = useBoclipsClient().links.video;

  return (
    <div className={s.playerWrapper}>
      <div className={s.header}>
        <p>
          <FilmIcon /> Highlight
        </p>
        <div className={s.durationBadge}>
          {formatDuration(clip.clipDuration)}
        </div>
      </div>
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
      <h1 className={s.clipTitle}>{clip.clipName}</h1>
      <div className={s.buttonWrapper}>
        <div className={s.actionbuttons} />
        <Feedback clipId={clip.clipId} />
      </div>
    </div>
  );
};

export default HighlightPlayer;
