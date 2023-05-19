import { ListViewVideo } from 'boclips-api-client/dist/sub-clients/videos/model/ListViewVideo';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import s from './style.module.less';

interface Props {
  video: ListViewVideo;
}

const Thumbnail = ({ video }: Props) => {

  const getThumbnailUrl = (fullVideo: any) => {
    return fullVideo.playback?._links?.thumbnail?.href;
  };

  return (
    <div className="h-36">
      <div
        className={s.thumbnails}
        // key={retrievedVideo.id}
        role="img"
        // aria-label={`Thumbnail of ${retrievedVideo.title}`}
        style={{
          background: `url(${getThumbnailUrl(video)}) center center`,
          backgroundSize: 'cover',
        }}
      />
    </div>
  );
};

export default Thumbnail;
