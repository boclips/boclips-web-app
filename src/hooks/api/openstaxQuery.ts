import { useQuery, UseQueryResult } from 'react-query';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

export const useGetBook = (bookId: string): UseQueryResult<Book> => {
  const apiClient = useBoclipsClient();

  return useQuery(['book', bookId], () => apiClient.openstax.getBook(bookId));
};
