import React, { useCallback, useEffect, useState } from 'react';
import {
  prefetchSearchQuery,
  useSearchQuery,
} from 'src/hooks/api/useSearchQuery';
import {
  SearchFilters,
  useSearchQueryLocationParams,
} from 'src/hooks/useLocationParams';
import Navbar from 'src/components/layout/Navbar';
import { FilterPanel } from 'src/components/filterPanel/FilterPanel';
import { SearchResults } from 'src/components/searchResults/SearchResults';
import Footer from 'src/components/layout/Footer';
import { FilterKey } from 'src/types/search/FilterKey';
import { useQueryClient } from 'react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { NoSearchResults } from 'src/components/noResults/NoSearchResults';
import { Loading } from 'src/components/common/Loading';
import { useDebounce } from 'src/hooks/useDebounce';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { ErrorBoundary } from 'src/components/common/errors/ErrorBoundary';
import RefreshPageError from 'src/components/common/errors/refreshPageError/RefreshPageError';
import { Layout } from 'src/components/layout/Layout';
import { ContentPackagePreviewBanner } from 'src/components/contentPackagePreviewBanner/ContentPackagePreviewBanner';

export const PAGE_SIZE = 30;

const SearchResultsView = () => {
  const queryClient = useQueryClient();
  const [searchLocation, setSearchLocation] = useSearchQueryLocationParams();
  const {
    query,
    page: currentPage,
    filters: filtersFromURL,
    content_package: contentPackage,
  } = searchLocation;
  const [newFiltersBeforeDebounce, setNewFiltersBeforeDebounce] =
    useState<SearchFilters>(filtersFromURL);

  const debouncedFilters = useDebounce(newFiltersBeforeDebounce, 1000);

  const boclipsClient = useBoclipsClient();

  const { data, isLoading, isFetching, isPreviousData } = useSearchQuery({
    query,
    page: currentPage - 1,
    pageSize: PAGE_SIZE,
    contentPackage,
    filters: debouncedFilters,
  });

  const hasNextPage = currentPage < data?.pageSpec?.totalPages;

  useEffect(() => {
    // Prefetch the next page of data
    if (hasNextPage) {
      prefetchSearchQuery(
        queryClient,
        {
          query,
          pageSize: PAGE_SIZE,
          page: currentPage,
          filters: debouncedFilters,
          contentPackage,
        },
        boclipsClient,
      );
    }
  }, [
    currentPage,
    query,
    debouncedFilters,
    queryClient,
    boclipsClient,
    hasNextPage,
    contentPackage,
  ]);

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
      setNewFiltersBeforeDebounce(newFilters);
      AnalyticsFactory.getAppcues().sendEvent(AppcuesEvent.FILTERS_APPLIED, {
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
    const emptyFilters = {
      duration: [],
      video_type: [],
      best_for: [],
      channel: [],
      subject: [],
      prices: [],
      release_date_from: [],
      release_date_to: [],
    };

    setSearchLocation({
      query,
      page: 1,
      content_package: '',
      filters: emptyFilters,
    });
    setNewFiltersBeforeDebounce(emptyFilters);
  }, [query, setSearchLocation]);

  const isNoSearchResults = data?.pageSpec?.totalElements === 0;

  const dateFilters = {
    to: filtersFromURL.release_date_to,
    from: filtersFromURL.release_date_from,
  };

  if (isLoading) return <Loading />;

  return (
    <Layout rowsSetup="grid-rows-default-view">
      <Navbar />
      <ErrorBoundary fallback={<RefreshPageError row="2" />}>
        <FilterPanel
          facets={data?.facets}
          dateFilters={dateFilters}
          handleChange={handleFilterChange}
          removeFilter={removeFilter}
          removeAllFilters={removeAllFilters}
          resultsFound={!isNoSearchResults}
          areFiltersApplied={areFiltersApplied(filtersFromURL)}
        />

        {isNoSearchResults ? (
          <NoSearchResults
            areFiltersApplied={areFiltersApplied(filtersFromURL)}
            query={query}
          />
        ) : (
          <SearchResults
            results={data}
            query={query}
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
    Object.keys(currentFilters).find((key) => currentFilters[key]?.length > 0)
      ?.length > 0
  );
};

export default SearchResultsView;
