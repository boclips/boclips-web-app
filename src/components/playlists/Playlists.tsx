import React, { useState } from 'react';

import { useDebounce } from '@src/hooks/useDebounce';

import PlaylistSearch from '@components/playlists/search/PlaylistSearch';
import { PlaylistTabs } from '@components/playlists/PlaylistTabs';
import s from './style.module.less';

const Playlists = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 1000);

  return (
    <main tabIndex={-1} className={s.playlistsWrapper}>
      <PlaylistSearch setQuery={setQuery} />
      <PlaylistTabs query={debouncedQuery} />
    </main>
  );
};

export default Playlists;
