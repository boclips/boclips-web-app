import React, { useState } from 'react';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';

import { useDebounce } from 'src/hooks/useDebounce';
import { FeatureGate } from 'src/components/common/FeatureGate';

import PlaylistSearch from 'src/components/playlists/search/PlaylistSearch';
import PlaylistList from 'src/components/playlists/PlaylistList';
import { PlaylistTabs } from 'src/components/playlists/PlaylistTabs';
import s from './style.module.less';

const Playlists = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 1000);
  const [page, setPage] = useState<number>(1);

  const { data: playlists, isInitialLoading } = useOwnAndSharedPlaylistsQuery(
    page,
    debouncedQuery,
  );

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0 });
    setPage(newPage);
  };

  return (
    <main tabIndex={-1} className={s.playlistsWrapper}>
      <PlaylistSearch setQuery={setQuery} />
      <FeatureGate
        feature="BO_WEB_APP_DEV"
        fallback={
          isInitialLoading ? (
            <SkeletonTiles className={s.skeletonCard} rows={3} cols={4} />
          ) : (
            <PlaylistList
              playlists={playlists}
              page={page}
              handlePageChange={handlePageChange}
            />
          )
        }
      >
        <PlaylistTabs
          playlists={playlists}
          isInitialLoading={isInitialLoading}
        />
      </FeatureGate>
    </main>
  );
};

export default Playlists;
