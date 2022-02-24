import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import s from './style.module.less';

interface Props {
  video: Video;
}

const Thumbnail = ({ video }: Props) => {
  const thumbnail = {
    id: video.id,
    title: video.title,
    href: video.playback?.links?.thumbnail?.getOriginalLink(),
  };

  return (
    <div
      className={`${s.thumbnail}`}
      key={thumbnail.id}
      role="img"
      aria-label={`Thumbnail of ${thumbnail.title}`}
      style={{
        background: `url(${thumbnail.href}) center center`,
        backgroundSize: 'cover',
      }}
    />
  );
};

export default Thumbnail;
