import React, { useCallback, useState } from 'react';
import { useSearchQuery } from '@src/hooks/api/useSearchQuery';
import {
  SearchFilters,
  useSearchQueryLocationParams,
} from '@src/hooks/useLocationParams';
import Navbar from '@components/layout/Navbar';
import { FilterPanel } from '@components/filterPanel/FilterPanel';
import { SearchResults } from '@components/searchResults/SearchResults';
import Footer from '@components/layout/Footer';
import { FilterKey } from '@src/types/search/FilterKey';
import { NoSearchResults } from '@components/noResults/NoSearchResults';
import { Loading } from '@components/common/Loading';
import { useDebounce } from '@src/hooks/useDebounce';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { ErrorBoundary } from '@components/common/errors/ErrorBoundary';
import RefreshPageError from '@components/common/errors/refreshPageError/RefreshPageError';
import { Layout } from '@components/layout/Layout';
import { ContentPackagePreviewBanner } from '@components/contentPackagePreviewBanner/ContentPackagePreviewBanner';
import { useGetDisciplinesQuery } from '@src/hooks/api/disciplinesQuery';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';

export const PAGE_SIZE = 30;

const SearchResultsView = () => {
  const [searchLocation, setSearchLocation] = useSearchQueryLocationParams();
  const {
    query,
    page: currentPage,
    filters: filtersFromURL,
    content_package: contentPackage,
  } = searchLocation;
  const [filtersToDebounce, setFiltersToDebounce] =
    useState<SearchFilters>(filtersFromURL);

  const debouncedFilters = useDebounce(filtersToDebounce, 1000);

  const { data: disciplines, isLoading: disciplinesLoading } =
    useGetDisciplinesQuery();

  const { data, isInitialLoading, isFetching, isPreviousData } = useSearchQuery(
    {
      query,
      page: currentPage - 1,
      pageSize: PAGE_SIZE,
      contentPackage,
      filters: { ...debouncedFilters, topics: filtersFromURL.topics },
    },
  );

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0 });

    setSearchLocation({
      query,
      page,
      content_package: contentPackage,
      filters: filtersFromURL,
    });
  };

  const handleFilterChange = useCallback(
    (key: FilterKey, values: string[]) => {
      const newFilters = {
        ...filtersFromURL,
        [key]: values,
      };

      setSearchLocation({
        query,
        page: 1,
        content_package: contentPackage,
        filters: newFilters,
      });
      if (key !== 'topics') {
        setFiltersToDebounce(newFilters);
      }

      AnalyticsFactory.hotjar().event(HotjarEvents.FiltersApplied, {
        filters: newFilters,
      });
    },
    [filtersFromURL, query, setSearchLocation, contentPackage],
  );

  const removeFilter = (key: FilterKey, value: string) => {
    const oldValues = filtersFromURL[key];
    const newValues = oldValues.filter((it) => value !== it);
    handleFilterChange(key, newValues);
  };

  const removeAllFilters = useCallback(() => {
    const emptyFilters: SearchFilters = {
      duration: [],
      video_type: [],
      best_for: [],
      channel: [],
      subject: [],
      release_date_from: [],
      release_date_to: [],
      education_level: [],
      topics: filtersFromURL.topics,
      language: [],
      cefr_level: [],
      subtype: [],
    };

    setSearchLocation({
      query,
      page: 1,
      filters: emptyFilters,
    });
    setFiltersToDebounce(emptyFilters);
  }, [query, setSearchLocation, filtersFromURL.topics]);

  const isNoSearchResults = data?.pageSpec?.totalElements === 0;

  const dateFilters = {
    to: filtersFromURL.release_date_to,
    from: filtersFromURL.release_date_from,
  };

  if (isInitialLoading || disciplinesLoading) return <Loading />;

  return (
    <Layout rowsSetup="grid-rows-search-view">
      <Navbar />
      <ErrorBoundary fallback={<RefreshPageError row="2" />}>
        <FilterPanel
          facets={data?.facets}
          disciplines={disciplines}
          dateFilters={dateFilters}
          handleChange={handleFilterChange}
          removeFilter={removeFilter}
          removeAllFilters={removeAllFilters}
          resultsFound={!isNoSearchResults}
          areFiltersApplied={areFiltersApplied(debouncedFilters)}
        />

        {isNoSearchResults ? (
          <NoSearchResults
            areFiltersApplied={areFiltersApplied(debouncedFilters)}
            query={query}
          />
        ) : (
          <SearchResults
            results={data}
            query={query}
            handleFilterChange={handleFilterChange}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            isFetching={isFetching && isPreviousData}
          />
        )}
        {contentPackage && (
          <ContentPackagePreviewBanner packageId={contentPackage} />
        )}
      </ErrorBoundary>
      <Footer />
    </Layout>
  );
};

const areFiltersApplied = (currentFilters: SearchFilters): boolean => {
  return (
    Object.keys(currentFilters).find(
      (key) => key !== 'topics' && currentFilters[key]?.length > 0,
    )?.length > 0
  );
};

export default SearchResultsView;
