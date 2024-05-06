import { act, renderHook, waitFor } from '@testing-library/react';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import {
  useEditPlaylistMutation,
  useGetPromotedPlaylistsQuery,
  useOwnAndEditableSharedPlaylistsQuery,
  useOwnPlaylistsQuery,
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
import { PromotedForProduct } from 'boclips-api-client/dist/sub-clients/collections/model/PromotedForProduct';
import { PLAYLISTS_PAGE_SIZE } from 'src/components/playlists/playlistList/PlaylistList';

describe('playlistsQuery', () => {
  it('will use list projection and convert page size when loading users playlists', async () => {
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'getMyCollections',
    );
    // @ts-ignore
    apiClient.collections.getMyCollections = collectionsSpy;
    const { result } = renderHook(() => useOwnPlaylistsQuery(1, 'bla'), {
      wrapper: wrapperWithClients(apiClient, new QueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(collectionsSpy).toBeCalledWith({
      page: 0,
      size: PLAYLISTS_PAGE_SIZE,
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
    const { result } = renderHook(() => useReorderPlaylist(collection), {
      wrapper: wrapperWithClients(apiClient, new QueryClient()),
    });

    act(() => result.current.mutate([video2, video1]));

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
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
    const { result } = renderHook(() => useEditPlaylistMutation(collection), {
      wrapper: wrapperWithClients(apiClient, new QueryClient()),
    });

    act(() =>
      result.current.mutate({
        title: 'That is great',
        description: 'This is too',
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
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

    await waitFor(() =>
      expect(playlistHook.result.current.isSuccess).toBeTruthy(),
    );
    expect(collectionsSpy).toBeCalledWith({
      origin: 'BO_WEB_APP',
      size: 500,
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

  it(`will get promotedFor playlists`, async () => {
    const apiClient = new FakeBoclipsClient();
    const collectionsSpy = jest.spyOn(
      apiClient.collections,
      'getPromotedForCollections',
    );
    // @ts-ignore
    apiClient.collections.getPromotedForCollections = collectionsSpy;

    const playlistHook = renderHook(
      () => useGetPromotedPlaylistsQuery(PromotedForProduct.CLASSROOM),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await waitFor(() =>
      expect(playlistHook.result.current.isSuccess).toBeTruthy(),
    );
    expect(collectionsSpy).toBeCalledWith({
      promotedFor: PromotedForProduct.CLASSROOM,
      origin: 'BO_WEB_APP',
    });
  });
});
