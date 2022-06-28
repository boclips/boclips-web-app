import { ListViewVideo } from 'boclips-api-client/dist/sub-clients/videos/model/ListViewVideo';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import s from './style.module.less';

interface Props {
  videos: ListViewVideo[];
}

const Thumbnails = ({ videos }: Props) => {
  const { data: firstVideo } = useFindOrGetVideo(videos[0]?.id);
  const { data: secondVideo } = useFindOrGetVideo(videos[1]?.id);
  const { data: thirdVideo } = useFindOrGetVideo(videos[2]?.id);

  const getThumbnailUrl = (video: Video) =>
    video.playback?.links?.thumbnail?.getOriginalLink();

  return (
    <div className={s.thumbnailsContainer}>
      {[firstVideo, secondVideo, thirdVideo].map((video, i) => {
        if (video) {
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
