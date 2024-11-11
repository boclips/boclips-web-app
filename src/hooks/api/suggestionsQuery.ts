import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useQuery } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';

const MINIMUM_SEARCH_LENGTH = 3;

export const useGetSuggestionsQuery = (query: string) => {
  const client = useBoclipsClient();
  return useQuery(['suggestions', query], async () =>
    getSuggestionsQuery(query, client),
  );
};
export const getSuggestionsQuery = (query: string, client: BoclipsClient) => {
  if (query && query.length >= MINIMUM_SEARCH_LENGTH) {
    return client.suggestions.suggest(query);
  }
  return Promise.resolve(null);
};
