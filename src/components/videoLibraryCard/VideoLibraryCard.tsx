import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { FeatureGate } from 'src/components/common/FeatureGate';
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
    <div className={s.card}>
      <Link
        to={{
          pathname: `/videos/${video.id}`,
        }}
      >
        <Thumbnail
          className={`${s.thumbnail} ${s.defaultThumbnail}`}
          video={video}
        />
        <div className={s.videoTitle}>{video.title}</div>
      </Link>
      <div className="flex flex-row justify-end p-1">
        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            key="cart-button"
            width="120px"
            labelAdd="Add"
            appcueEvent={AppcuesEvent.ADD_TO_CART_FROM_PLAYLIST_PAGE}
          />
        </FeatureGate>
      </div>
    </div>
  );
};
