import { useQuery, useQueryClient } from '@tanstack/react-query';
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

export const doGetVideoRecommendations = (
  video: Video,
  apiClient: BoclipsClient,
) => {
  return apiClient.videos.getRecommendations(video);
};

export const doGetVideo = (id: string, apiClient: BoclipsClient) =>
  apiClient.videos.get(id);

export const doGetVideoWithReferer = (
  id: string,
  apiClient: BoclipsClient,
  referer: string,
): Promise<Video> => {
  return apiClient.videos.get(id, referer);
};

export const useGetVideoWithReferer = (videoId: string, referer: string) => {
  const apiClient = useBoclipsClient();
  return useQuery(
    ['videoWithReferer', videoId],
    () => doGetVideoWithReferer(videoId, apiClient, referer),
    {
      enabled: !!videoId && !!referer,
    },
  );
};

export const useGetVideos = (videoIds: string[]) => {
  const apiClient = useBoclipsClient();
  return useQuery(['multipleVideos'], () => doGetVideos(videoIds, apiClient), {
    enabled: !!videoIds,
  });
};

export const useGetVideoRecommendations = (video: Video) => {
  const apiClient = useBoclipsClient();
  return useQuery(
    [`getVideoRecommendations-${video ? video.id : 'undefined'}`],
    () => doGetVideoRecommendations(video, apiClient),
  );
};

export const useFindOrGetVideo = (videoId?: string) => {
  const queryClient = useQueryClient();
  const apiClient = useBoclipsClient();
  const cachedVideos = queryClient.getQueriesData<Pageable<Video>>([
    SEARCH_BASE_KEY,
  ]);

  return useQuery(['video', videoId], () => doGetVideo(videoId, apiClient), {
    initialData: () => findVideoInSearchCache(cachedVideos, videoId),
    enabled: !!videoId,
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
