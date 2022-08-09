import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { useGetBook, useGetBooksQuery } from 'src/hooks/api/openstaxQuery';
import { renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from 'react-query';
import { waitFor } from '@testing-library/react';

describe('OpenstaxQuery', () => {
  it('gets an openstax book by id', async () => {
    const fakeClient = new FakeBoclipsClient();

    const book = BookFactory.sample({
      title: 'The history of art',
      id: 'art-history-id',
    });

    fakeClient.openstax.setOpenstaxBooks([book]);

    const bookHook = renderHook(() => useGetBook('art-history-id'), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    await waitFor(() => bookHook.result.current.isSuccess);
    expect(bookHook.result.current.data.id).toEqual('art-history-id');
    expect(bookHook.result.current.data.title).toEqual('The history of art');
  });

  it('gets all books', async () => {
    const fakeClient = new FakeBoclipsClient();

    const books = [BookFactory.sample({ id: 'id-1' })];
    fakeClient.openstax.setOpenstaxBooks(books);

    const getBooksHook = renderHook(() => useGetBooksQuery(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    await waitFor(() => getBooksHook.result.current.isSuccess);

    expect(books).toHaveLength(1);
    expect(books[0].id).toEqual('id-1');
  });
});
