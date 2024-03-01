import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import s from './style.module.less';

interface Props {
  video: Video;
}

const Thumbnail = ({ video }: Props) => {
  const thumnailUrl = video.playback?.links?.thumbnail?.getOriginalLink();

  return (
    <div className="h-36">
      {thumnailUrl ? (
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
