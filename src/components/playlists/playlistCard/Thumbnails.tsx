import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import s from './style.module.less';

interface Props {
  videos: Video[];
}

const Thumbnails = ({ videos }: Props) => {
  const thumbnails = videos.map((it) => ({
    id: it.id,
    title: it.title,
    // @ts-ignore
    href: it.playback?._links?.thumbnail?.href,
  }));

  return (
    <div className={s.thumbnailsContainer}>
      {[0, 1, 2].map((_, i) => {
        if (thumbnails[i]) {
          return (
            <div
              className={s.thumbnails}
              key={thumbnails[i].id}
              role="img"
              aria-label={`Thumbnail of ${thumbnails[i].title}`}
              style={{
                background: `url(${thumbnails[i].href}) center center`,
                backgroundSize: 'cover',
              }}
            />
          );
        }
        return <div key={i} className={s.thumbnails} />;
      })}
    </div>
  );
};

export default Thumbnails;
