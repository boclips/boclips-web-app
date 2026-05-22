import { renderHook, waitFor } from '@testing-library/react';
import { useFindOrGetVideo, useGetVideos } from 'src/hooks/api/videoQuery';
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

    const { result: result1 } = renderHookForFindOrGetVideo();
    await waitFor(() => expect(result1.current.isSuccess).toBeTruthy());
    expect(result1.current.data.title).toEqual('Cached video from search');

    const { result: result2 } = renderHookForFindOrGetVideo();
    await waitFor(() => expect(result2.current.isSuccess).toBeTruthy());
    expect(result2.current.data.title).toEqual('Updated video');
  });

  it('useGetVideos uses different cache keys for different ID sets', async () => {
    const queryClient = new QueryClient();
    const boclipsClient = new FakeBoclipsClient();

    boclipsClient.videos.insertVideo(
      VideoFactory.sample({ id: 'a', title: 'Video A' }),
    );
    boclipsClient.videos.insertVideo(
      VideoFactory.sample({ id: 'b', title: 'Video B' }),
    );

    const { result: resultA } = renderHook(() => useGetVideos(['a']), {
      wrapper: wrapperWithClients(boclipsClient, queryClient),
    });
    const { result: resultB } = renderHook(() => useGetVideos(['b']), {
      wrapper: wrapperWithClients(boclipsClient, queryClient),
    });

    await waitFor(() => expect(resultA.current.isSuccess).toBeTruthy());
    await waitFor(() => expect(resultB.current.isSuccess).toBeTruthy());

    expect(resultA.current.data.map((v) => v.id)).toEqual(['a']);
    expect(resultB.current.data.map((v) => v.id)).toEqual(['b']);
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
