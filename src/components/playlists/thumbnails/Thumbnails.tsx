import { ListViewAsset } from 'boclips-api-client/dist/sub-clients/videos/model/ListViewVideo';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import s from './style.module.less';

interface Props {
  assets: ListViewAsset[];
}

const Thumbnails = ({ assets }: Props) => {
  const videoIds = assets.slice(0, 3).map((asset) => asset.id.videoId);
  const { data: videos, isLoading } = useGetVideos(videoIds);

  const getThumbnailUrl = (video: Video) =>
    video.playback?.links?.thumbnail?.getOriginalLink();

  return (
    <div className={s.thumbnailsContainer}>
      {[0, 1, 2].map((i) => {
        const video = videos?.[i];
        if (video && !isLoading) {
          return (
            <div
              className={s.thumbnails}
              key={video.id}
              role="img"
              aria-label={`Thumbnail of ${video.title}`}
              style={{
                background: `url(${getThumbnailUrl(video)}) center center`,
                backgroundSize: 'cover',
              }}
            />
          );
        }
        return (
          <div
            key={`default-thumbnail-${i}`}
            data-qa={`default-thumbnail-${i}`}
            className={s.thumbnails}
          />
        );
      })}
    </div>
  );
};

export default Thumbnails;
