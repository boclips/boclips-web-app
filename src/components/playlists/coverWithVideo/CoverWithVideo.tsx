import React, { useEffect, useState } from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import s from 'src/components/playlists/style.module.less';
import { handleEnterKeyDown } from 'src/services/handleEnterKeyDown';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

interface Props {
  video: Video;
}

const CoverWithVideo = ({ video }: Props) => {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [ref, setRef] = useState();

  useEffect(() => {
    if (ref) {
      // @ts-ignore
      ref.container?.querySelector('video').oncanplay = () => {
        // @ts-ignore
        ref.play();
      };
    }
  }, [ref]);

  if (showPlayer)
    return (
      <div data-qa="player">
        <VideoPlayer setRef={setRef} video={video} />
      </div>
    );

  return (
    <div
      style={{
        // @ts-ignore
        backgroundImage: `url(${video?.playback?._links?.thumbnail?.href})`,
      }}
      className={s.cover}
      data-qa={video.id}
    >
      <button
        type="button"
        aria-labelledby={`${video.id}-label`}
        aria-describedby={`${video.id}-description`}
        onClick={() => {
          setShowPlayer(true);
        }}
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
