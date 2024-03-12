import React, { useState } from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import PlaylistList from 'src/components/playlists/playlistList/PlaylistList';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import s from 'src/components/playlists/style.module.less';

interface Props {
  query: string;
}

export const PlaylistListWrapper = ({ query }: Props) => {
  const [page, setPage] = useState<number>(1);

  const { data: playlists, isInitialLoading } = useOwnAndSharedPlaylistsQuery(
    page,
    query,
  );

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    setPage(newPage);
  };
  return isInitialLoading ? (
    <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
  ) : (
    <PlaylistList
      playlists={playlists}
      playlistType="mine"
      page={page}
      handlePageChange={handlePageChange}
    />
  );
};
