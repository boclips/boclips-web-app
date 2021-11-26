import React from 'react';
import HomeImageSVG from 'src/resources/icons/home-search.svg';
import { Search } from 'src/components/searchBar/SearchBar';
import { prefetchSearchQuery } from 'src/hooks/api/useSearchQuery';
import { PAGE_SIZE } from 'src/views/search/SearchResultsView';
import { useQueryClient } from 'react-query';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { useBoclipsClient } from '../common/providers/BoclipsClientProvider';

const SearchHero = () => {
  const queryClient = useQueryClient();
  const boclipsClient = useBoclipsClient();

  const onSearch = (query) => {
    prefetchSearchQuery(
      queryClient,
      {
        query,
        page: 0,
        pageSize: PAGE_SIZE,
      },
      boclipsClient,
    );
    AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.HOMEPAGE_SEARCH, {
      query,
    });
  };

  return (
    <>
      <div className="col-start-1 col-end-25 row-start-2 row-end-2 bg-primary-light rounded-lg" />
      <div className="col-start-3 col-end-15 md:col-start-4 md:col-end-15 lg:col-start-4 lg:col-end-15 row-start-2 row-end-2 self-center">
        <h1 className="mb-8 text-4xl font-medium">
          What videos do you need today?
        </h1>
        <Search size="big" showIconOnly={false} onSearch={onSearch} />
      </div>
      <div className="col-start-16 col-end-25 row-start-2 row-end-2 self-center justify-self-start z-0">
        <HomeImageSVG />
      </div>
    </>
  );
};

export default SearchHero;
