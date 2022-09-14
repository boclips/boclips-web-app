import { Video } from 'boclips-api-client/dist/types';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import React from 'react';
import s from './VideoGridCardContainer.module.less';
import { OpenstaxVideoCardButtons } from './OpenstaxVideoCardButtons';

interface Props {
  videos: Video[];
}

export const VideoGridCardContainer = ({ videos }: Props) => (
  <div className={s.container}>
    {videos.map((video) => (
      <VideoGridCard
        key={video.id}
        video={video}
        buttonsRow={<OpenstaxVideoCardButtons video={video} />}
      />
    ))}
  </div>
);
