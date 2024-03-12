import React, { useState } from 'react';

import { useDebounce } from 'src/hooks/useDebounce';

import PlaylistSearch from 'src/components/playlists/search/PlaylistSearch';
import { PlaylistTabs } from 'src/components/playlists/PlaylistTabs';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { PlaylistListWrapper } from 'src/components/playlists/playlistList/PlaylistListWrapper';
import s from './style.module.less';

const Playlists = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 1000);

  return (
    <main tabIndex={-1} className={s.playlistsWrapper}>
      <PlaylistSearch setQuery={setQuery} />
      <FeatureGate
        feature="BO_WEB_APP_DEV"
        fallback={<PlaylistListWrapper query={query} />}
      >
        <PlaylistTabs query={debouncedQuery} />
      </FeatureGate>
    </main>
  );
};

export default Playlists;
