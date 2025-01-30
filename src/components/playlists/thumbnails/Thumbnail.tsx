import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import s from './style.module.less';

interface Props {
  video: Video;
  className?: string;
}

const Thumbnail = ({ video, className = 'h-36' }: Props) => {
  const thumbnailUrl = video?.playback?.links?.thumbnail?.getOriginalLink();

  return (
    <div className={className}>
      {thumbnailUrl ? (
        <div
          className={s.thumbnails}
          key={video.id}
          role="img"
          aria-label={`Thumbnail of ${video.title}`}
          style={{
            background: `url(${video.playback?.links?.thumbnail?.getOriginalLink()}) center center`,
            backgroundSize: 'cover',
          }}
        />
      ) : (
        <div
          key="default-thumbnail"
          data-qa="default-thumbnail"
          className={s.thumbnails}
        />
      )}
    </div>
  );
};

export default Thumbnail;
