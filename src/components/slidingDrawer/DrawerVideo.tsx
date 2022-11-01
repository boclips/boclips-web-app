import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import React from 'react';

interface Props {
  video: Video;
}

const DrawerVideo = ({ video }: Props) => {
  return <VideoPlayer video={video} />;
};

export default DrawerVideo;
