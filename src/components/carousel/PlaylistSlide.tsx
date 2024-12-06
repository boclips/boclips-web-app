import { Typography } from 'boclips-ui';
import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '@components/playlists/thumbnails/Thumbnail';
import { useFindOrGetVideo } from '@src/hooks/api/videoQuery';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';

interface Props {
  playlist: Collection;
}

export const PlaylistSlide = ({ playlist }: Props) => {
  const videoId = playlist.assets[0].id;
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
          <Typography.Body>{playlist.assets.length} videos</Typography.Body>
        </div>
      </div>
    </Link>
  );
};
