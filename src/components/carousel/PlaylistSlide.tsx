import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

interface Props {
  playlist: Collection;
  video?: Video;
}

export const PlaylistSlide = ({ playlist, video }: Props) => {
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
