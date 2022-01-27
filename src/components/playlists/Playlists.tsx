import React from 'react';
import { usePlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import PlaylistTile from './playlistTile/PlaylistTile';
import s from './style.module.less';

const Playlists = () => {
  const { data: playlists } = usePlaylistsQuery();

  return (
    <div className={s.playlistsWrapper}>
      {playlists?.map((playlist) => (
        <PlaylistTile key={playlist.id} name={playlist.title} />
      ))}
    </div>
  );
};

export default Playlists;
