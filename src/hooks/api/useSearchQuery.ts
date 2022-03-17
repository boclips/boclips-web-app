import { QueryClient, useQuery } from 'react-query';
import { VideoSearchResults } from 'boclips-api-client/dist/sub-clients/videos/model/VideoSearchResults';
import { DEFAULT_DURATIONS } from 'src/types/DefaultDurations';
import { BoclipsClient } from 'boclips-api-client';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { FilterKey } from 'src/types/search/FilterKey';
import dayjs from 'dayjs';

export const SEARCH_BASE_KEY = 'videos';

export interface SearchQuery {
  query: string;
  page: number;
  pageSize: number;
  contentPackage?: string;
  filters?: { [key in FilterKey]: string[] };
}

const doSearch = (
  { query, page, pageSize, filters, contentPackage }: SearchQuery,
  apiClient: BoclipsClient,
) =>
  apiClient.videos.search({
    query,
    page,
    size: pageSize,
    prices: filters?.prices,
    type: filters?.video_type,
    best_for: filters?.best_for,
    subject: filters?.subject,
    channel: filters?.channel,
    duration: filters?.duration,
    released_date_to:
      filters?.release_date_to &&
      filters?.release_date_to[0] &&
      dayjs(filters?.release_date_to[0]).format('YYYY-MM-DD'),
    released_date_from:
      filters?.release_date_from &&
      filters?.release_date_from[0] &&
      dayjs(filters?.release_date_from[0]).format('YYYY-MM-DD'),
    duration_facets: DEFAULT_DURATIONS,
    include_channel_facets: true,
    include_education_level_facets: true,
    education_level: filters?.education_level,
    content_package: contentPackage,
  });

const generateSearchKey = ({
  query,
  page,
  pageSize,
  filters,
  contentPackage,
}: SearchQuery) => [
  SEARCH_BASE_KEY,
  { query, page, pageSize, filters, contentPackage },
];

export const useSearchQuery = (searchQuery: SearchQuery) => {
  const apiClient = useBoclipsClient();
  return useQuery<VideoSearchResults, any>(
    generateSearchKey(searchQuery),
    () => doSearch(searchQuery, apiClient),
    {
      keepPreviousData: true,
    },
  );
};
export const prefetchSearchQuery = (
  queryClient: QueryClient,
  searchQuery: SearchQuery,
  boclipsClient: BoclipsClient,
) =>
  queryClient.prefetchQuery(generateSearchKey(searchQuery), () =>
    doSearch(searchQuery, boclipsClient),
  );
