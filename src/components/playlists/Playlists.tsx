import React from 'react';
import { usePlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import c from 'classnames';
import PlaylistTile from './playlistTile/PlaylistTile';
import s from './style.module.less';

const Playlists = () => {
  const { data: playlists, isLoading } = usePlaylistsQuery();

  return (
    <div className={s.playlistsWrapper}>
      {isLoading ? (
        <SkeletonTiles />
      ) : (
        playlists?.map((playlist) => (
          <PlaylistTile
            key={playlist.id}
            id={playlist.id}
            name={playlist.title}
          />
        ))
      )}
    </div>
  );
};

const SkeletonTiles = () => {
  const numberOfTiles = 8;
  const skeletonsToRender = Array.from(Array(numberOfTiles).keys());

  return (
    <>
      {skeletonsToRender.map((i) => (
        <div key={i} className={c(s.playlistTile, s.skeleton)} />
      ))}
    </>
  );
};

export default Playlists;
