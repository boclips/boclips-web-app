import React, { useState } from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useSearchQuery } from 'src/hooks/api/useSearchQuery';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import DrawerVideoList from 'src/components/slidingDrawer/DrawerVideoList';

interface Props {
  onVideoAdded: (video: Video) => void;
}

const DrawerVideoSearch = ({ onVideoAdded }: Props) => {
  const [query, setQuery] = useState<string>(null);
  const { data } = useSearchQuery({
    query,
    page: 0,
    pageSize: 6,
  });

  return (
    <>
      <span className="flex flex-col mb-4">
        <SearchBar
          placeholder="Search for videos"
          onSearch={(phrase) => setQuery(phrase)}
        />
      </span>
      {data && (
        <DrawerVideoList videos={data.page} onVideoAdded={onVideoAdded} />
      )}
    </>
  );
};

export default DrawerVideoSearch;
