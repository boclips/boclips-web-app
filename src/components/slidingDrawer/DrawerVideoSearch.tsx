import React, { useState } from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useSearchQuery } from 'src/hooks/api/useSearchQuery';
import DrawerVideo from 'src/components/slidingDrawer/DrawerVideo';
import c from 'classnames';
import s from './DrawerVideoSearch.module.less';

const DrawerVideoSearch = () => {
  const [query, setQuery] = useState<string>(null);
  const { data } = useSearchQuery({
    query,
    page: 0,
    pageSize: 6,
  });

  return (
    <div>
      <SearchBar
        placeholder="Search for videos"
        onSearch={(phrase) => setQuery(phrase)}
      />
      <div className={c(s.drawerSearchResults)}>
        {data?.page.map((video, index) => (
          <div className={`${c(s.drawerSearchResult)}${index % 3}`}>
            <DrawerVideo video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawerVideoSearch;
