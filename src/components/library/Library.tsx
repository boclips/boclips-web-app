import React, { ReactElement } from 'react';
import PlaylistTile from 'src/components/library/PlaylistTile';
import s from './style.module.less';

const Library = (): ReactElement => {
  const playlists = ['box', 'print', 'scorn', 'sing', 'group', 'kneel'];

  return (
    <>
      <div className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 flex flex-row">
        <div className={`${s.title} text-2xl`}>Your Library</div>
      </div>

      <div className={s.playlistsWrapper}>
        {playlists.map((name) => (
          <PlaylistTile name={name} />
        ))}
        ;
      </div>
    </>
  );
};

export default Library;
