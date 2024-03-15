import s from 'src/components/playlists/style.module.less';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import PlaylistList from 'src/components/playlists/playlistList/PlaylistList';
import React, { useState } from 'react';
import { Content } from '@radix-ui/react-tabs';

import { UseQueryResult } from '@tanstack/react-query';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';

interface Props {
  query: string;
  type: 'mine' | 'shared' | 'boclips';
  value: string;
  getPlaylistsQuery: (
    page: number,
    query: string,
  ) => UseQueryResult<Pageable<ListViewCollection>, unknown>;
}
export const PlaylistTab = ({
  query,
  getPlaylistsQuery,
  type,
  value,
}: Props) => {
  const [page, setPage] = useState<number>(1);
  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    setPage(newPage);
  };
  const { data: playlists, isInitialLoading: isLoading } = getPlaylistsQuery(
    page,
    query,
  );

  return (
    <Content value={value} className={s.tabContent} >
      {isLoading ? (
        <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
      ) : (
        <PlaylistList
          playlists={playlists}
          playlistType={type}
          handlePageChange={handlePageChange}
          page={page}
        />
      )}
    </Content>
  );
};
