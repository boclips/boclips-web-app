import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import { useFindAccountUsers } from 'src/hooks/api/userQuery';

describe('userQuery', () => {
  it('finds the account users', async () => {
    const fakeClient = new FakeBoclipsClient();
    const accountsSpy = jest.spyOn(fakeClient.accounts, 'getAccountUsers');
    // @ts-ignore
    fakeClient.accounts.getAccountUsers = accountsSpy;
    const { result, waitFor } = renderHook(
      () => useFindAccountUsers('account-1', 2, 10),
      {
        wrapper: wrapperWithClients(fakeClient, new QueryClient()),
      },
    );

    await waitFor(() => result.current.isSuccess);
    expect(accountsSpy).toBeCalledWith({
      id: 'account-1',
      page: 2,
      size: 10,
    });
  });
});
