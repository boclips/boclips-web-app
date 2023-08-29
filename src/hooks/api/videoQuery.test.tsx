import { act, renderHook } from '@testing-library/react';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient } from '@tanstack/react-query';
import { SEARCH_BASE_KEY } from 'src/hooks/api/useSearchQuery';
import { PageableFactory } from 'boclips-api-client/dist/sub-clients/common/model/PageableFactory';
import { Video } from 'boclips-api-client/dist/types';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { wrapperWithClients } from 'src/testSupport/wrapper';

describe('VideoQuery', () => {
  it('load initial data from search cache', async () => {
    const queryClient = new QueryClient();
    const boclipsClient = new FakeBoclipsClient();
    const VIDEO_ID = '123';

    cacheVideoSearchResults(queryClient, { page: 0 }, []);
    cacheVideoSearchResults(queryClient, { page: 1 }, [
      VideoFactory.sample({
        id: VIDEO_ID,
        title: 'Cached video from search',
      }),
    ]);
    cacheVideoSearchResults(queryClient, { page: 2 }, []);

    boclipsClient.videos.insertVideo(
      VideoFactory.sample({
        id: VIDEO_ID,
        title: 'Updated video',
      }),
    );

    const renderHookForFindOrGetVideo = () =>
      renderHook(() => useFindOrGetVideo(VIDEO_ID), {
        wrapper: wrapperWithClients(boclipsClient, queryClient),
      });

    await act(async () => {
      const { result, waitFor } = renderHookForFindOrGetVideo();

      await waitFor(() => result.current !== undefined);
      expect(result.current.data.title).toEqual('Cached video from search');
    });

    await act(async () => {
      const { result, waitFor } = renderHookForFindOrGetVideo();

      await waitFor(() => result.current.isSuccess);
      expect(result.current.data.title).toEqual('Updated video');
    });
  });

  const cacheVideoSearchResults = (
    queryClient: QueryClient,
    filter,
    data: Video[],
  ) => {
    queryClient.setQueryData(
      [SEARCH_BASE_KEY, filter],
      PageableFactory.sample<Video>(data),
    );
  };
});
