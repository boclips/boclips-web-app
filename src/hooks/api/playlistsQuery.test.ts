import { act, renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import {
  useEditPlaylistMutation,
  useOwnAndEditableSharedPlaylistsQuery,
  useOwnAndSharedPlaylistsQuery,
  useRemoveCommentFromPlaylistVideo,
  useReorderPlaylist,
  useUpdatePlaylistPermissionsMutation,
} from 'src/hooks/api/playlistsQuery';
import { QueryClient } from '@tanstack/react-query';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';

describe('playlistsQuery', () => {
  it('will use list projection and convert page size when loading users playlists', async () => {
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'getMySavedCollectionsWithoutDetails',
    );
    // @ts-ignore
    apiClient.collections.getMySavedCollectionsWithoutDetails = collectionsSpy;
    const { result, waitFor } = renderHook(
      () => useOwnAndSharedPlaylistsQuery(1, 'bla'),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await waitFor(() => result.current.isSuccess);
    expect(collectionsSpy).toBeCalledWith({
      page: 0,
      size: 20,
      origin: 'BO_WEB_APP',
      partialTitleMatch: true,
      query: 'bla',
    });
  });

  it('safely reorders playlists', async () => {
    const [video1, video2] = [
      VideoFactory.sample({ id: 'video-1' }),
      VideoFactory.sample({ id: 'video-2' }),
    ];
    const collection = CollectionFactory.sample({ videos: [video1, video2] });
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(apiClient.collections, 'safeUpdate');
    // @ts-ignore
    apiClient.collections.safeUpdate = collectionsSpy;
    const { result, waitFor } = renderHook(
      () => useReorderPlaylist(collection),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await act(() => result.current.mutate([video2, video1]));
    await waitFor(() => result.current.isSuccess);
    expect(collectionsSpy).toBeCalledWith(collection, {
      videos: [video2.id, video1.id],
    });
  });

  it('safely updates playlists', async () => {
    const collection = CollectionFactory.sample({});
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(apiClient.collections, 'safeUpdate');
    // @ts-ignore
    apiClient.collections.safeUpdate = collectionsSpy;
    const { result, waitFor } = renderHook(
      () => useEditPlaylistMutation(collection),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await act(() =>
      result.current.mutate({
        title: 'That is great',
        description: 'This is too',
      }),
    );
    await waitFor(() => result.current.isSuccess);
    expect(collectionsSpy).toBeCalledWith(collection, {
      title: 'That is great',
      description: 'This is too',
    });
  });

  it('will get own and editable playlists', async () => {
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'getMySavedAndEditableCollectionsWithoutDetails',
    );
    // @ts-ignore
    apiClient.collections.getMySavedAndEditableCollectionsWithoutDetails =
      collectionsSpy;

    const playlistHook = renderHook(
      () => useOwnAndEditableSharedPlaylistsQuery(),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await playlistHook.waitFor(() => playlistHook.result.current.isSuccess);
    expect(collectionsSpy).toBeCalledWith({
      origin: 'BO_WEB_APP',
      size: 1000,
    });
  });

  it('will update playlist permissions', async () => {
    const collection = CollectionFactory.sample({});

    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'updatePermission',
    );
    // @ts-ignore
    apiClient.collections.updatePermission = collectionsSpy;

    const { result } = renderHook(
      () => useUpdatePlaylistPermissionsMutation(collection),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await act(() => result.current.mutate(CollectionPermission.EDIT));

    expect(collectionsSpy).toBeCalled();
  });

  it('will remove comment from a playlist video', async () => {
    const collection = CollectionFactory.sample({
      comments: {
        videos: {
          'video-id': [
            {
              id: 'comment-id',
              userId: 'user-id',
              name: 'userName',
              email: 'user@boclips.com',
              text: 'My user comment',
              createdAt: 'now',
            },
          ],
        },
      },
    });

    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'removeCommentFromCollectionVideo',
    );
    // @ts-ignore
    apiClient.collections.removeCommentFromCollectionVideo = collectionsSpy;

    const { result } = renderHook(
      () => useRemoveCommentFromPlaylistVideo(collection),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await act(() => result.current.mutate('comment-id'));

    expect(collectionsSpy).toBeCalled();
  });
});
