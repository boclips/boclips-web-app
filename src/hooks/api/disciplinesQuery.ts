import { BoclipsClient } from 'boclips-api-client';
import { useQuery } from 'react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

export const doGetDisciplines = (client: BoclipsClient) => {
  return client.disciplines.getAll();
};

export const useGetDisciplinesQuery = () => {
  const client = useBoclipsClient();
  return useQuery('disciplines', async () => doGetDisciplines(client));
};
