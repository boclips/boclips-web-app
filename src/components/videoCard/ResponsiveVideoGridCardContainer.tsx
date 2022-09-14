import { Video } from 'boclips-api-client/dist/types';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import React from 'react';
import s from 'src/components/videoCard/responsiveVideoGridCardContainer.module.less';
import { VideoCardButtons } from './buttons/VideoCardButtons';

interface Props {
  videos: Video[];
}

export const ResponsiveVideoGridCardContainer = ({ videos }: Props) => (
  <div className={s.container}>
    {videos.map((video) => (
      <VideoGridCard
        key={video.id}
        video={video}
        buttonsRow={<VideoCardButtons video={video} iconOnly />}
      />
    ))}
  </div>
);
