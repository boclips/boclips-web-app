import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { renderHook, waitFor } from '@testing-library/react';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import useUserProducts from 'src/hooks/useUserProducts';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('user products', () => {
  it('get products of current user', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
        },
      }),
    );
    const { result } = renderHook(() => useUserProducts(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    await waitFor(() =>
      expect(result.current.products).toEqual([Product.CLASSROOM]),
    );
  });

  it('defaults products to empty array when null', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: null,
          type: AccountType.STANDARD,
        },
      }),
    );
    const { result } = renderHook(() => useUserProducts(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    await waitFor(() => expect(result.current.products).toEqual([]));
  });
});
