import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import { BoclipsClient } from 'boclips-api-client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

export const useGetDisciplinesQuery = (): UseQueryResult<Discipline[]> => {
  const client = useBoclipsClient();
  return useQuery(['discipline'], async () => getMyDisciplines(client));
};

const getMyDisciplines = (client: BoclipsClient) => {
  return client.disciplines.getMyDisciplines();
};
