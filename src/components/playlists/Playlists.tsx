import React from 'react';
import { usePlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import Thumbnails from 'src/components/playlists/playlistCard/Thumbnails';
import PlaylistCard from './playlistCard/PlaylistCard';
import s from './style.module.less';

const Playlists = () => {
  const { data: playlists, isLoading } = usePlaylistsQuery();

  return (
    <main className={s.playlistsWrapper}>
      {isLoading ? (
        <SkeletonTiles className={s.playlistCard} />
      ) : (
        playlists?.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            id={playlist.id}
            name={playlist.title}
            header={<Thumbnails videos={playlist.videos} />}
          />
        ))
      )}
    </main>
  );
};

export default Playlists;
