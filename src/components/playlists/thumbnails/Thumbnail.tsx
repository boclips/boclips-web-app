import { ListViewVideo } from 'boclips-api-client/dist/sub-clients/videos/model/ListViewVideo';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import s from './style.module.less';

interface Props {
  video: ListViewVideo;
}

const Thumbnail = ({ video }: Props) => {
  const { data: retrievedVideo, isLoading: firstLoading } = useFindOrGetVideo(
    video?.id,
  );

  const getThumbnailUrl = (fullVideo: Video) =>
    fullVideo.playback?.links?.thumbnail?.getOriginalLink();

  return (
    <div className="h-36">
      {(video && firstLoading === false && (
        <div
          className={s.thumbnails}
          key={retrievedVideo.id}
          role="img"
          aria-label={`Thumbnail of ${retrievedVideo.title}`}
          style={{
            background: `url(${getThumbnailUrl(retrievedVideo)}) center center`,
            backgroundSize: 'cover',
          }}
        />
      )) ?? (
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
