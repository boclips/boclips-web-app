import { useQuery, UseQueryResult } from 'react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { convertApiBookToOpenstaxBook } from 'src/services/convertApiBookToOpenstaxBook';
import { BoclipsClient } from 'boclips-api-client';

export const useGetBook = (bookId: string): UseQueryResult<OpenstaxBook> => {
  const apiClient = useBoclipsClient();

  return useQuery(['book', bookId], () =>
    apiClient.openstax.getBook(bookId).then(convertApiBookToOpenstaxBook),
  );
};

export const useGetBooksQuery = (): UseQueryResult<OpenstaxBook[]> => {
  const client = useBoclipsClient();
  return useQuery('books', () => doGetBooks(client));
};

const doGetBooks = (client: BoclipsClient) =>
  client.openstax
    .getAllMappedOpenstaxBooks()
    .then((booksWrapper) =>
      booksWrapper.books.map(convertApiBookToOpenstaxBook),
    );
