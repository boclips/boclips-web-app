import React, { useState } from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useSearchQuery } from 'src/hooks/api/useSearchQuery';

const DrawerVideoSearch = () => {
  const [query, setQuery] = useState<string>(null);
  const { data } = useSearchQuery({
    query,
    page: 0,
    pageSize: 5,
  });

  return (
    <div>
      <SearchBar
        placeholder="Search for videos"
        onSearch={(phrase) => setQuery(phrase)}
      />
      <div>
        {data?.page.map((video) => (
          <span>{video.title}</span>
        ))}
      </div>
    </div>
  );
};

export default DrawerVideoSearch;
