import { useQuery, useQueryClient } from 'react-query';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsClient } from 'boclips-api-client';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { SEARCH_BASE_KEY } from 'src/hooks/api/useSearchQuery';

export const doGetVideos = (videoIds: string[], apiClient: BoclipsClient) => {
  return apiClient.videos
    .search({
      id: videoIds,
    })
    .then((items) => items.page);
};

export const doGetVideo = (id: string, apiClient: BoclipsClient) =>
  apiClient.videos.get(id);

export const useGetVideos = (videoIds: string[]) => {
  const apiClient = useBoclipsClient();
  return useQuery('cartItemVideos', () => doGetVideos(videoIds, apiClient), {
    enabled: !!videoIds,
  });
};

export const useFindOrGetVideo = (videoId?: string) => {
  const queryClient = useQueryClient();
  const apiClient = useBoclipsClient();
  const cachedVideos =
    queryClient.getQueriesData<Pageable<Video>>(SEARCH_BASE_KEY);

  return useQuery(['video', videoId], () => doGetVideo(videoId, apiClient), {
    initialData: () => findVideoInSearchCache(cachedVideos, videoId),
    enabled: !!videoId,
  });
};

export const useFindOrGetVideos = (videoIds: string[]) => {
  const queryClient = useQueryClient();
  const apiClient = useBoclipsClient();
  const cachedVideos =
    queryClient.getQueriesData<Pageable<Video>>(SEARCH_BASE_KEY);

  return useQuery(['video', videoIds], () => doGetVideos(videoIds, apiClient), {
    initialData: () => findVideosInSearchCache(cachedVideos, videoIds),
    enabled: !!videoIds,
  });
};

const findVideoInSearchCache = (
  cache: [any, Pageable<Video>][],
  videoId: string,
) => {
  let cachedVideoFromSearch;

  cache.find(([key, videos]) => {
    cachedVideoFromSearch = videos?.page?.find((v) => v.id === videoId);
    return cachedVideoFromSearch ? [key, videos] : undefined;
  });

  return cachedVideoFromSearch;
};

const findVideosInSearchCache = (
  cache: [any, Pageable<Video>][],
  videoIds: string[],
) => {
  const cachedVideosFromSearch = [];

  videoIds.forEach((id) =>
    cachedVideosFromSearch.push(findVideoInSearchCache(cache, id)),
  );

  return cachedVideosFromSearch;
};
