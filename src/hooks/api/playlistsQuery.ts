import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BoclipsClient } from 'boclips-api-client';
import { CreateCollectionRequest } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';

interface UpdatePlaylistProps {
  playlist: Collection;
  videoId: string;
}

export const useOwnAndSharedPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('ownAndSharedPlaylists', () =>
    doGetOwnAndSharedPlaylists(client),
  );
};

export const useOwnPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('ownPlaylists', () => doGetOwnPlaylists(client));
};

export const usePlaylistQuery = (id: string) => {
  const queryClient = useQueryClient();
  const client = useBoclipsClient();

  const cachedPlaylists =
    queryClient.getQueryData<Pageable<Collection>>('playlists');
  return useQuery(
    ['playlist', id],
    () => client.collections.get(id, 'details'),
    {
      initialData: () => cachedPlaylists?.page?.find((c) => c.id === id),
    },
  );
};

export const doAddToPlaylist = (
  playlist: Collection,
  videoId: string,
  client: BoclipsClient,
) => {
  return client.collections.addVideoToCollection(playlist, videoId);
};

export const doRemoveFromPlaylist = (
  playlist: Collection,
  videoId: string,
  client: BoclipsClient,
) => {
  return client.collections.removeVideoFromCollection(playlist, videoId);
};

export const useAddToPlaylistMutation = (callback: (id) => void) => {
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
      },
      onError: (_, { playlist, videoId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `Error: Failed to add video to ${playlist.title}`,
          'Please refresh the page and try again',
          `add-video-${videoId}-to-playlist`,
        );
        callback(playlist.id);
      },
    },
  );
};

export const useRemoveFromPlaylistMutation = (callback: (id) => void) => {
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
      },
      onError: (_, { playlist, videoId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `Error: Failed remove video from ${playlist.title}`,
          'Please refresh the page and try again',
          `add-video-${videoId}-to-playlist`,
        );
        callback(playlist.id);
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(['playlist', variables.playlist.id]);
      },
    },
  );
};

const doGetOwnPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMyCollections({ origin: 'BO_WEB_APP', projection: 'details' })
    .then((playlists) => playlists.page);

const doGetOwnAndSharedPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMySavedCollections({ origin: 'BO_WEB_APP', projection: 'details' })
    .then((playlists) => playlists.page);

export const usePlaylistMutation = () => {
  const client = useBoclipsClient();
  return useMutation((request: CreateCollectionRequest) =>
    client.collections.create(request),
  );
};
