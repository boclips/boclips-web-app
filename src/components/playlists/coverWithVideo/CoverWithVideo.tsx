import React, { useEffect, useState } from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import s from 'src/components/playlists/style.module.less';
import { handleEnterKeyDown } from 'src/services/handleEnterKeyDown';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { BoclipsPlayer } from 'boclips-player/lib/BoclipsPlayer/BoclipsPlayer';

interface Props {
  video: Video;
}

const CoverWithVideo = ({ video }: Props) => {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [ref, setRef] = useState<BoclipsPlayer>();

  useEffect(() => {
    if (ref) {
      // @ts-ignore
      ref.container?.querySelector('video').oncanplay = () => {
        ref.play();
      };
    }
  }, [ref]);

  if (showPlayer) return <VideoPlayer setRef={setRef} video={video} />;

  return (
    <div
      style={{
        backgroundImage: `url(${video?.playback?.links?.thumbnail?.getOriginalLink()})`,
      }}
      className={s.cover}
      data-qa={video.id}
    >
      <button
        type="button"
        aria-labelledby={`${video.id}-label`}
        aria-describedby={`${video.id}-description`}
        onClick={() => setShowPlayer(true)}
        onKeyDown={(e) => handleEnterKeyDown(e, () => setShowPlayer(true))}
      >
        <div className={s.play} />
      </button>
      <span id={`${video.id}-label`}>play {video.title}</span>
      <span id={`${video.id}-description`}>{video.description}</span>
    </div>
  );
};

export default CoverWithVideo;
