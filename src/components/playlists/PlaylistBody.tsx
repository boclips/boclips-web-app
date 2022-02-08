import React from 'react';
import c from 'classnames';
import PlaylistCard from 'src/components/playlists/playlistCard/PlaylistCard';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Thumbnail from 'src/components/playlists/playlistCard/Thumbnail';
import s from './style.module.less';

interface Props {
  videos: Video[];
}

const PlaylistBody = ({ videos }: Props) => {
  return (
    <>
      <h4 className="grid-row-start-4 grid-row-end-4 col-start-2 col-end-26 mb-0">
        In this playlist:
      </h4>
      <div
        className={c(
          s.cardWrapper,
          'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
        )}
      >
        {videos.map((video) => {
          return (
            <PlaylistCard
              link={`/videos/${video.id}`}
              name={video.title}
              key={video.id}
              header={<Thumbnail video={video} />}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlaylistBody;
