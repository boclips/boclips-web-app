import React from 'react';
import s from './style.module.less';

interface Props {
  name: string;
}

const PlaylistTile = ({ name }: Props) => {
  return (
    <div className={s.playlistTile}>
      <div className={s.thumbnailsContainer}>
        <div
          className={`${s.thumbnail} ${s.defaultThumbnail} row-span-2 grid-cols-1`}
        />
        <div
          className={`${s.thumbnail} ${s.defaultThumbnail} grid-rows-1 grid-cols-2`}
        />
        <div
          className={`${s.thumbnail} ${s.defaultThumbnail} grid-rows-2 grid-cols-2`}
        />
      </div>
      <div className={s.header}>{name}</div>
    </div>
  );
};

export default PlaylistTile;
