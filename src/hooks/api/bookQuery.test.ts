import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { QueryClient } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { useGetBooksQuery } from 'src/hooks/api/bookQuery';

describe('Book query', () => {
  it('gets all books', async () => {
    const books = await renderWithBooks([BookFactory.sample({ id: 'id-1' })]);

    expect(books).toHaveLength(1);
    expect(books[0].id).toEqual('id-1');
  });
});

const renderWithBooks = async (books: Book[]): Promise<Book[]> => {
  const queryClient = new QueryClient();
  const boclipsClient = new FakeBoclipsClient();
  boclipsClient.openstax.setOpenstaxBooks(books);

  const { result, waitFor } = renderHook(() => useGetBooksQuery(), {
    wrapper: wrapperWithClients(boclipsClient, queryClient),
  });

  await waitFor(() => result.current.isSuccess);
  return result.current.data;
};
