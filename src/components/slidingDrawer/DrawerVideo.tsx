import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import React from 'react';
import Button from '@boclips-ui/button';

interface Props {
  video: Video;
  onAddPressed: (video: Video) => void;
}

const DrawerVideo = ({ video, onAddPressed }: Props) => {
  return (
    <>
      <VideoPlayer video={video} />
      <span className="pt-2">
        <Button
          height="34px"
          width="34px"
          text="+"
          onClick={() => onAddPressed(video)}
        />
      </span>
    </>
  );
};

export default DrawerVideo;
