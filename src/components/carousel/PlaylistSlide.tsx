import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';

export const PlaylistSlide = ({ playlist }) => {
  const videoId = playlist.videos[0].id;
  const { data: video } = useFindOrGetVideo(videoId);

  return (
    <Link
      to={{
        pathname: `/playlists/${playlist.id}`,
      }}
      aria-label={`${playlist.title} grid card`}
    >
      <div className="mx-4 bg-white rounded-lg shadow-lg pb-2 h-64">
        <Thumbnail video={video} />
        <div className="m-3 flex justify-between h-24 flex-col">
          <Typography.H4 className="truncate">{playlist.title}</Typography.H4>
          <Typography.Body>{playlist.videos.length} videos</Typography.Body>
        </div>
      </div>
    </Link>
  );
};
