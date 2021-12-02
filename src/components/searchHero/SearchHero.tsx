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
      <div className="col-start-2 col-end-26 row-start-2 row-end-2 bg-primary-light rounded-lg" />
      <div className="col-start-4 col-end-16 md:col-start-5 md:col-end-16 lg:col-start-5 lg:col-end-16 row-start-2 row-end-2 self-center">
        <h1 className="mb-8 text-4xl font-medium">
          What videos do you need today?
        </h1>
        <Search size="big" showIconOnly={false} onSearch={onSearch} />
      </div>
      <div className="col-start-17 col-end-26 row-start-2 row-end-2 self-center justify-self-start z-0">
        <HomeImageSVG />
      </div>
    </>
  );
};

export default SearchHero;
