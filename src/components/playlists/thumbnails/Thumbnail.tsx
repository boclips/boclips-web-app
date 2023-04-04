import { ListViewVideo } from 'boclips-api-client/dist/sub-clients/videos/model/ListViewVideo';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import s from './style.module.less';

interface Props {
  video: ListViewVideo;
}

const Thumbnails = ({ video }: Props) => {
  const { data: firstVideo, isLoading: firstLoading } = useFindOrGetVideo(
    video?.id,
  );

  const getThumbnailUrl = (fullVideo: Video) =>
    fullVideo.playback?.links?.thumbnail?.getOriginalLink();

  return (
    <div className={"h-40"}>
      {(firstVideo && firstLoading === false && (
        <div
          className={s.thumbnails}
          key={firstVideo.id}
          role="img"
          aria-label={`Thumbnail of ${firstVideo.title}`}
          style={{
            background: `url(${getThumbnailUrl(firstVideo)}) center center`,
            backgroundSize: 'cover',
          }}
        />
      )) ?? (
        <div
          key={`default-thumbnail`}
          data-qa={`default-thumbnail`}
          className={s.thumbnails}
        />
      )}
    </div>
  );
};

export default Thumbnails;
