import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useQuery } from 'react-query';
import { BoclipsClient } from 'boclips-api-client';

export const useGetBooksQuery = () => {
  const client = useBoclipsClient();
  return useQuery('books', () => doGetBooks(client));
};

const doGetBooks = (client: BoclipsClient) =>
  client.openstax
    .getAllMappedOpenstaxBooks()
    .then((booksWrapper) => booksWrapper.books);
