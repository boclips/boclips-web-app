import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';
import {
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { CollectionsClient } from 'boclips-api-client/dist/sub-clients/collections/client/CollectionsClient';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { PLAYLISTS_PAGE_SIZE } from 'src/components/playlists/Playlists';
import { playlistKeys } from './playlistKeys';

interface UpdatePlaylistProps {
  playlist: Collection | ListViewCollection;
  videoId: string;
}

interface PlaylistMutationCallbacks {
  onSuccess: (playlistId: string) => void;
  onError: (playlistId: string) => void;
}

export const useOwnAndSharedPlaylistsQuery = (page: number, query?: string) => {
  const client = useBoclipsClient();
  const backendPageNumber = page - 1;
  return useQuery(playlistKeys.ownAndShared(backendPageNumber, query), () =>
    doGetOwnAndSharedPlaylists(client, backendPageNumber, query),
  );
};

export const useOwnPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery(playlistKeys.own, () => doGetOwnPlaylists(client));
};

export const usePlaylistQuery = (id: string) => {
  const client = useBoclipsClient();

  return useQuery(playlistKeys.detail(id), () =>
    client.collections.get(id, 'details'),
  );
};

export const doAddToPlaylist = (
  playlist: Collection | ListViewCollection,
  videoId: string,
  client: BoclipsClient,
) => {
  return client.collections.addVideoToCollection(playlist, videoId);
};

export const doRemoveFromPlaylist = (
  playlist: Collection | ListViewCollection,
  videoId: string,
  client: BoclipsClient,
) => {
  return client.collections.removeVideoFromCollection(playlist, videoId);
};

export const doFollowPlaylist = (
  playlist: Collection,
  collectionsClient: CollectionsClient,
) => {
  return collectionsClient.bookmark(playlist);
};

export const useAddToPlaylistMutation = (
  callbacks: PlaylistMutationCallbacks,
) => {
  const client = useBoclipsClient();
  return useMutation(
    async ({ playlist, videoId }: UpdatePlaylistProps) =>
      doAddToPlaylist(playlist, videoId, client),
    {
      onSuccess: (_, { playlist, videoId }) => {
        displayNotification(
          'success',
          `Video added to "${playlist.title}"`,
          '',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onSuccess(playlist.id);
      },
      onError: (_, { playlist, videoId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `Error: Failed to add video to ${playlist.title}`,
          'Please refresh the page and try again',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onError(playlist.id);
      },
    },
  );
};

export const useRemoveFromPlaylistMutation = (
  callbacks: PlaylistMutationCallbacks,
) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ playlist, videoId }: UpdatePlaylistProps) =>
      doRemoveFromPlaylist(playlist, videoId, client),
    {
      onSuccess: (_, { playlist, videoId }) => {
        displayNotification(
          'success',
          `Video removed from "${playlist.title}"`,
          '',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onSuccess(playlist.id);
      },
      onError: (_, { playlist, videoId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `Error: Failed remove video from ${playlist.title}`,
          'Please refresh the page and try again',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onError(playlist.id);
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(
          playlistKeys.detail(variables.playlist.id),
        );
      },
    },
  );
};

const doGetOwnPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMyCollectionsWithoutDetails({ origin: 'BO_WEB_APP' })
    .then((playlists) => playlists.page);

const doGetOwnAndSharedPlaylists = (
  client: BoclipsClient,
  page: number,
  query?: string,
) => {
  return client.collections
    .getMySavedCollectionsWithoutDetails({
      query,
      partialTitleMatch: true,
      page,
      size: PLAYLISTS_PAGE_SIZE,
      origin: 'BO_WEB_APP',
    })
    .then((playlists) => playlists);
};

export const usePlaylistMutation = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (request: CreateCollectionRequest) => client.collections.create(request),
    {
      onSettled: () => {
        queryClient.invalidateQueries(playlistKeys.own);
      },
    },
  );
};

export const useEditPlaylistMutation = (playlist: Collection) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (request: UpdateCollectionRequest) =>
      client.collections.update(playlist.id, request),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(playlistKeys.detail(playlist.id));
        queryClient.invalidateQueries(playlistKeys.own);
      },
    },
  );
};

export const useRemovePlaylistMutation = (playlist: Collection) => {
  const client = useBoclipsClient();

  return useMutation(() => client.collections.delete(playlist));
};
