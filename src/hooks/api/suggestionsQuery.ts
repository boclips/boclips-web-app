import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useQuery } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';

export const useGetSuggestionsQuery = (query: string) => {
  const client = useBoclipsClient();
  return useQuery(['suggestions', query], async () =>
    getSuggestionsQuery(query, client),
  );
};
export const getSuggestionsQuery = (query: string, client: BoclipsClient) => {
  return client.suggestions.suggest(query);
};
