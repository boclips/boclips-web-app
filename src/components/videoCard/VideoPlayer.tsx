import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Player } from 'boclips-player-react';
import { AnalyticsOptions } from 'boclips-player/dist/Events/AnalyticsOptions';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import getPlayerOptions from '@components/videoCard/playerOptionsFactory/playerOptionsFactory';
import { PlaybackSegment } from 'boclips-player/dist/MediaPlayer/MediaPlayer';
import s from './VideoPlayer.module.less';

interface Props {
  video?: Video;
  videoLink?: Link;
  controls?: 'cart';
  showDurationBadge?: boolean;
  setRef?: any;
  analytics?: Partial<AnalyticsOptions>;
  segment?: PlaybackSegment;
}

export const VideoPlayer = ({
  video,
  videoLink,
  controls,
  showDurationBadge = false,
  setRef = () => null,
  analytics,
  segment,
}: Props) => {
  const options = getPlayerOptions(controls, showDurationBadge, analytics);

  return (
    <div data-qa="player" className={s.playerWrapper}>
      <Player
        playerRef={setRef}
        videoUri={
          video?.links?.self.getOriginalLink() || videoLink?.getOriginalLink()
        }
        borderRadius="4px"
        options={options}
        segment={segment}
      />
    </div>
  );
};
