import { useQuery, useQueryClient } from 'react-query';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsClient } from 'boclips-api-client';

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

export const useGetOrderedVideos = (videoIds: string[]) => {
  const apiClient = useBoclipsClient();

  return useQuery(['orderVideos', videoIds], () =>
    doGetVideos(videoIds, apiClient),
  );
};

export const useFindOrGetVideo = (videoId?: string) => {
  const queryClient = useQueryClient();
  const apiClient = useBoclipsClient();
  const cachedVideos = queryClient.getQueryData<Pageable<Video>>(
    'videosSearch',
  );

  return useQuery(['videos', videoId], () => doGetVideo(videoId, apiClient), {
    initialData: () => cachedVideos?.page.find((v) => v.id === videoId),
    enabled: !!videoId,
  });
};
