import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';
import {
  AddCommentToCollectionVideRequest,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { CollectionsClient } from 'boclips-api-client/dist/sub-clients/collections/client/CollectionsClient';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { PLAYLISTS_PAGE_SIZE } from 'src/components/playlists/Playlists';
import { useNavigate } from 'react-router-dom';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
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

export const useGetPromotedPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery(['promoted'], () => doGetPromotedPlaylists(client));
};

export const useOwnAndEditableSharedPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery(playlistKeys.own, () =>
    doGetOwnAndEditableSharedPlaylists(client),
  );
};

export const usePlaylistQuery = (id: string) => {
  const client = useBoclipsClient();

  return useQuery(playlistKeys.detail(id), () =>
    client.collections.get(id, 'details'),
  );
};

export const doAddCommentToVideo = (
  collection: Collection,
  request: AddCommentToCollectionVideRequest,
  client: BoclipsClient,
) => {
  return client.collections.addCommentToCollectionVideo(collection, request);
};

export const useAddCommentToVideo = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    ({
      playlist,
      request,
    }: {
      playlist: Collection;
      request: AddCommentToCollectionVideRequest;
    }) => doAddCommentToVideo(playlist, request, client),
    {
      onSuccess: (playlist) => {
        displayNotification(
          'success',
          `Comment added to "${playlist.title}"`,
          '',
          `add-comment-${playlist.id}-to-playlist`,
        );
      },
      onError: (playlist: Collection) => {
        displayNotification(
          'error',
          `Error: Failed to add a comment to a video -- ${playlist.title}`,
          'Please refresh the page and try again',
          `add-comment-${playlist.id}-to-playlist`,
        );
      },
      onSettled: ({ id }) => {
        queryClient.invalidateQueries({
          queryKey: ['playlists', id],
        });
      },
    },
  );
};

export const doRemoveCommentFromVideo = (
  collection: Collection,
  commentId: string,
  client: BoclipsClient,
) => {
  return client.collections.removeCommentFromCollectionVideo(
    collection,
    commentId,
  );
};

export const useRemoveCommentFromPlaylistVideo = (playlist: Collection) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (commentId: string) =>
      doRemoveCommentFromVideo(playlist, commentId, client),
    {
      onSuccess: () => {
        displayNotification(
          'success',
          `Comment removed from "${playlist.title}"`,
          '',
          `remove-comment-${playlist.id}-to-playlist`,
        );
      },
      onError: () => {
        displayNotification(
          'error',
          `Error: Failed to remove comment from a video -- ${playlist.title}`,
          'Please refresh the page and try again',
          `remove-comment-${playlist.id}-to-playlist`,
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['playlists', playlist.id],
        });
      },
    },
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

const doGetOwnAndEditableSharedPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMySavedAndEditableCollectionsWithoutDetails({
      origin: 'BO_WEB_APP',
      size: 1000,
    })
    .then((playlists) => {
      return playlists.page;
    });

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

const doGetPromotedPlaylists = (client: BoclipsClient) => {
  return client.collections
    .getPromotedCollections()
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
      client.collections.safeUpdate(playlist, request),
    {
      onMutate: () => {},
      onSuccess: () => {
        queryClient.invalidateQueries(playlistKeys.detail(playlist.id));
        queryClient.invalidateQueries(playlistKeys.own);
      },
    },
  );
};

export const useRemovePlaylistMutation = (playlist: Collection) => {
  const client = useBoclipsClient();
  const navigate = useNavigate();

  return useMutation(() => client.collections.delete(playlist), {
    onSuccess: () => {
      navigate('/playlists');
    },

    onError: () => {
      displayNotification(
        'error',
        `Error: Failed to remove playlist ${playlist.title}`,
        'Please refresh the page and try again',
        `remove-playlist-failed`,
      );
    },
  });
};

export const useUpdatePlaylistPermissionsMutation = (playlist: Collection) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (permission: CollectionPermission) =>
      client.collections
        .updatePermission(playlist, { anyone: permission })
        .then(() => permission),
    {
      onSuccess: (permission) => {
        displayNotification(
          'success',
          `Success: playlist permissions changed to ${permission}`,
          '',
          `update-playlist-permissions-success`,
        );
      },

      onError: () => {
        displayNotification(
          'error',
          `Error: Failed to change playlist permissions`,
          'Please refresh the page and try again',
          `update-playlist-permissions-failed`,
        );
      },
      onSettled: () => {
        queryClient.refetchQueries({ queryKey: ['playlists', playlist.id] });
      },
    },
  );
};

export const useUnfollowPlaylistMutation = (playlist: Collection) => {
  const client = useBoclipsClient();
  const navigate = useNavigate();

  return useMutation(() => client.collections.unbookmark(playlist), {
    onSuccess: () => {
      navigate('/playlists');
    },

    onError: () => {
      displayNotification(
        'error',
        `Error: Failed to unfollow playlist ${playlist.title}`,
        'Please refresh the page and try again',
        `unfollow-playlist-failed`,
      );
    },
  });
};

export const useReorderPlaylist = (playlist: Collection) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (videos: Video[]) =>
      client.collections.safeUpdate(playlist, {
        videos: videos.map((it) => it.id),
      }),
    {
      onMutate: async (videos: Video[]) => {
        await queryClient.cancelQueries({
          queryKey: ['playlists', playlist.id],
        });

        const previousPlaylist = queryClient.getQueryData([
          'playlists',
          playlist.id,
        ]);

        queryClient.setQueryData(['playlists', playlist.id], () => {
          const newVideosList = { ...(previousPlaylist as Collection) };

          newVideosList.videos = videos;

          return newVideosList;
        });

        return previousPlaylist;
      },
      onError: (err, _videos, context) => {
        console.error(err);
        queryClient.setQueryData(['playlists', playlist.id], context);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['playlists', playlist.id] });
      },
    },
  );
};
