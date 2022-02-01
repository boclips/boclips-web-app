import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BoclipsClient } from 'boclips-api-client';
import { CreateCollectionRequest } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import axios from 'axios';

export const usePlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('playlists', () => doGetPlaylists(client));
};

export const usePlaylistQuery = (id: string) => {
  const queryClient = useQueryClient();
  const client = useBoclipsClient();

  const cachedPlaylists = queryClient.getQueryData<Pageable<Collection>>(
    'playlists',
  );
  return useQuery(['playlist', id], () => client.collections.get(id), {
    initialData: () => cachedPlaylists?.page?.find((c) => c.id === id),
  });
};

export const doAddToPlaylist = (playlist: Collection, videoId: string) => {
  const url = playlist.links.addVideo.getTemplatedLink({
    video_id: videoId,
  });

  return axios.put(url);
};

export const doRemoveFromPlaylist = (playlist: Collection, videoId: string) => {
  const url = playlist.links.removeVideo.getTemplatedLink({
    video_id: videoId,
  });

  return axios.delete(url);
};

const doGetPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMyCollections({ origin: 'BO_WEB_APP' })
    .then((playlists) => playlists.page);

export const usePlaylistMutation = () => {
  const client = useBoclipsClient();
  return useMutation((request: CreateCollectionRequest) =>
    client.collections.create(request),
  );
};
