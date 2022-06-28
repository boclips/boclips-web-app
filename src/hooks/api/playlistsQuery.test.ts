import { renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { useOwnAndSharedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import { QueryClient } from 'react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';

describe('playlistsQuery', () => {
  it('will use list projection when loading users playlists', async () => {
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'getMySavedCollectionsWithoutDetails',
    );
    // @ts-ignore
    apiClient.collections.getMySavedCollectionsWithoutDetails = collectionsSpy;
    const { result, waitFor } = renderHook(
      () => useOwnAndSharedPlaylistsQuery(),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await waitFor(() => result.current.isSuccess);
    expect(collectionsSpy).toBeCalledWith({ origin: 'BO_WEB_APP' });
  });
});
