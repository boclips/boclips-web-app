import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { useGetBook } from 'src/hooks/api/openstaxQuery';
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
});
