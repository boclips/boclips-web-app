import React, { useEffect, useState } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Segment } from 'boclips-api-client/dist/sub-clients/collections/model/Segment';
import { BoclipsPlayer } from 'boclips-player/dist/BoclipsPlayer/BoclipsPlayer';
import getFormattedDuration from 'src/services/getFormattedDuration';
import PlayButton from 'src/components/common/playButton/PlayButton';
import { VideoPlayer } from './VideoPlayer';
import s from './LazyVideoPlayer.module.less';

interface Props {
  video?: Video;
  showDurationBadge?: boolean;
  segment?: Segment;
}

export const LazyVideoPlayer = ({
  video,
  showDurationBadge,
  segment,
}: Props) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [playerRef, setPlayerRef] = useState<BoclipsPlayer>();

  useEffect(() => {
    if (playerRef) {
      // @ts-ignore
      playerRef.container?.querySelector('video').oncanplay = () => {
        playerRef.play();
      };
    }
  }, [playerRef]);

  if (showPlayer) {
    return (
      <VideoPlayer
        video={video}
        segment={segment}
        setRef={setPlayerRef}
      />
    );
  }

  const duration = video?.playback?.duration;

  return (
    <div
      data-qa="player"
      className={s.thumbnailContainer}
      style={{
        backgroundImage: `url(${video?.playback?.links?.thumbnail?.getOriginalLink()})`,
      }}
    >
      <button
        type="button"
        className={s.playButton}
        aria-label={`Play ${video?.title}`}
        onClick={() => setShowPlayer(true)}
      >
        <PlayButton />
      </button>
      {showDurationBadge && duration && (
        <div className={s.durationBadge} aria-hidden>
          {getFormattedDuration(duration)}
        </div>
      )}
    </div>
  );
};
