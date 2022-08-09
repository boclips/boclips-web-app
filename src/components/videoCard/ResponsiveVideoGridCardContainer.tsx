import { Video } from 'boclips-api-client/dist/types';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import React from 'react';
import s from 'src/components/videoCard/responsiveVideoGridCardContainer.module.less';

interface Props {
  videos: Video[];
}

export const ResponsiveVideoGridCardContainer = ({ videos }: Props) => (
  <div className={s.container}>
    {videos.map((video) => (
      <VideoGridCard video={video} />
    ))}
  </div>
);
