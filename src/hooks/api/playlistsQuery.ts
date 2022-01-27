import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useQuery } from 'react-query';
import { BoclipsClient } from 'boclips-api-client';

export const usePlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('playlists', () => doGetPlaylists(client));
};

const doGetPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMyCollections({ origin: 'BO_WEB_APP' })
    .then((playlists) => playlists.page);
