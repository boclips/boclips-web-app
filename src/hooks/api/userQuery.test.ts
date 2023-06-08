import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { act, renderHook } from '@testing-library/react-hooks';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import { useFindAccountUsers, useUpdateUser } from 'src/hooks/api/userQuery';
import { UpdateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';

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

  it('updates a user', async () => {
    const fakeClient = new FakeBoclipsClient();
    const usersSpy = jest.spyOn(fakeClient.users, 'updateUser');
    // @ts-ignore
    fakeClient.users.updateUser = usersSpy;

    const request: UpdateUserRequest = {
      type: UserType.b2bUser,
      permissions: {
        canOrder: true,
        canManageUsers: true,
      },
    };
    const { result, waitFor } = renderHook(() => useUpdateUser(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    const accountUser: AccountUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'bla@boclips.com',
      permissions: {
        canOrder: false,
        canManageUsers: false,
      },
    };

    await act(() =>
      result.current.mutate({
        user: accountUser,
        request,
      }),
    );

    await waitFor(() => result.current.isSuccess);
    expect(usersSpy).toBeCalledWith('user-1', request);
  });
});
