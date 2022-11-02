import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import React from 'react';

interface Props {
  video: Video;
  onAddPressed: (video: Video) => void;
}

const DrawerVideo = ({ video, onAddPressed }: Props) => {
  return (
    <div>
      <VideoPlayer video={video} />
      <button type="button" onClick={() => onAddPressed(video)}>
        Add
      </button>
    </div>
  );
};

export default DrawerVideo;
