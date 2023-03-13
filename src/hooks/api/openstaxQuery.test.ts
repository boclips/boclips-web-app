import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import {
  useGetBook,
  useGetBooksQuery,
  useGetTypesByProviderQuery,
} from 'src/hooks/api/openstaxQuery';
import { renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';

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

    await bookHook.waitFor(() => bookHook.result.current.isSuccess);

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

    await getBooksHook.waitFor(() => getBooksHook.result.current.isSuccess);
    const result = getBooksHook.result.current.data;

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('id-1');
  });

  it('gets all openstax types', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.alignments.setTypesForProvider('openstax', [
      'Math',
      'Languages',
      'Science',
    ]);

    const hook = renderHook(() => useGetTypesByProviderQuery('openstax'), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    await hook.waitFor(() => hook.result.current.isSuccess);
    const result = hook.result.current.data;

    expect(result).toHaveLength(3);
    expect(result).toContain('Math');
    expect(result).toContain('Languages');
    expect(result).toContain('Science');
  });
});
