import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { Loading } from 'src/components/common/Loading';
import { Link } from 'react-router-dom';
import style from './style.module.less';

interface Props {
  videoId: string;
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

export const VideoLibraryCard = ({ videoId }: Props) => {
  const { data: video, isLoading } = useFindOrGetVideo(videoId);

  if (isLoading || !video) return <Loading />;

  return (
    <Link
      to={{
        pathname: `/videos/${video.id}`,
      }}
      aria-label={`Open video about ${video.title}`}
      className={style.videoLibraryCardTile}
    >
      <Thumbnail
        className={`${style.videoLibraryCardThumbnail} ${style.defaultThumbnail}`}
        video={video}
      />
      <div className={`${style.videoTitle}`}>{video.title}</div>
    </Link>
  );
};
