import React, { useState } from 'react';
import SearchBar from '@boclips-ui/search-bar';
import { useSearchQuery } from 'src/hooks/api/useSearchQuery';
import DrawerVideo from 'src/components/slidingDrawer/DrawerVideo';
import c from 'classnames';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import s from './DrawerVideoSearch.module.less';

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
      <div className={c(s.drawerSearchResults)}>
        {data?.page.map((video, index) => (
          <span className="flex flex-col" key={index}>
            <DrawerVideo video={video} onAddPressed={onVideoAdded} />
          </span>
        ))}
      </div>
    </>
  );
};

export default DrawerVideoSearch;
