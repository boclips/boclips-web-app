import { BoclipsClient } from 'boclips-api-client';
import { useQuery } from '@tanstack/react-query';
import { useBoclipsClient } from '@components/common/providers/BoclipsClientProvider';
import { Projection } from 'boclips-api-client/dist/sub-clients/common/model/Projection';

export const doGetChannels = (client: BoclipsClient) => {
  return client.channels.getAll({ projection: Projection.LIST });
};

export const useGetChannelsQuery = () => {
  const client = useBoclipsClient();
  return useQuery(['channels'], async () => doGetChannels(client));
};
