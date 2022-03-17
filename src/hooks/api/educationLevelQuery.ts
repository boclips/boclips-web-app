import { BoclipsClient } from 'boclips-api-client';
import { useQuery } from 'react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

export const getEducationLevelsQuery = (client: BoclipsClient) => {
  return client.educationLevels.getAll();
};

export const useGetEducationLevelsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('educationLevels', async () =>
    getEducationLevelsQuery(client),
  );
};
