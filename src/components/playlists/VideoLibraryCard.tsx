import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import s from './style.module.less';

interface Props {
  video: Video;
}

const Thumbnail = ({ className, video }) => {
  const thumbnailUrl = video.playback?.links?.thumbnail?.getOriginalLink();

  return thumbnailUrl ? (
    <div
      className={className}
      key={video.id}
      role="img"
      aria-label={`Thumbnail of ${video.title}`}
      style={{
        background: `url(${thumbnailUrl}) center center`,
        backgroundSize: 'cover',
      }}
    />
  ) : (
    <div className={className} />
  );
};

export const VideoLibraryCard = ({ video }: Props) => {
  return (
    <Link
      to={{
        pathname: `/videos/${video.id}`,
      }}
      className={s.videoLibraryCardTile}
    >
      <Thumbnail
        className={`${s.videoLibraryCardThumbnail} ${s.defaultThumbnail}`}
        video={video}
      />
      <div className={s.videoTitle}>{video.title}</div>
    </Link>
  );
};
