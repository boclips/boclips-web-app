import React from 'react';
import { usePlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import PlaylistTile from './playlistTile/PlaylistTile';
import s from './style.module.less';

const Playlists = () => {
  const { data: playlists, isLoading } = usePlaylistsQuery();

  return (
    <main className={s.playlistsWrapper}>
      {isLoading ? (
        <SkeletonTiles className={s.playlistTile} />
      ) : (
        playlists?.map((playlist) => (
          <PlaylistTile
            key={playlist.id}
            id={playlist.id}
            name={playlist.title}
          />
        ))
      )}
    </main>
  );
};

export default Playlists;
