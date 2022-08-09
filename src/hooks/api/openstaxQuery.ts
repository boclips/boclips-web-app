import { useQuery, UseQueryResult } from 'react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { convertApiBookToOpenstaxBook } from 'src/services/convertApiBookToOpenstaxBook';

export const useGetBook = (bookId: string): UseQueryResult<OpenstaxBook> => {
  const apiClient = useBoclipsClient();

  return useQuery(['book', bookId], () =>
    apiClient.openstax.getBook(bookId).then(convertApiBookToOpenstaxBook),
  );
};
