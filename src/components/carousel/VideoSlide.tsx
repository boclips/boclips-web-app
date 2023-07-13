import { Link } from 'react-router-dom';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Video } from 'boclips-api-client/dist/types';

const VideoSlide = ({ video }: { video: Video }) => (
  <Link
    to={{
      pathname: `/videos/${video.id}`,
    }}
    state={{
      userNavigated: true,
    }}
    aria-label={`${video.title} grid card`}
  >
    <div className="mx-4 bg-white rounded-lg shadow-lg pb-2 h-64">
      <Thumbnail video={video} />
      <div className="m-3">
        <Typography.H4 className="truncate">{video.title}</Typography.H4>
      </div>
    </div>
  </Link>
);

export default VideoSlide;
