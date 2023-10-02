import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { act, renderHook, waitFor } from '@testing-library/react';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import {
  useAddNewTrialUser,
  useFindAccountUsers,
  useUpdateUser,
} from 'src/hooks/api/userQuery';
import {
  UpdateUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import {
  CreateTrialUserRequest,
  UserType as CreationUserType,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';

describe('userQuery', () => {
  it('finds the account users', async () => {
    const fakeClient = new FakeBoclipsClient();
    const accountsSpy = jest.spyOn(fakeClient.accounts, 'getAccountUsers');
    // @ts-ignore
    fakeClient.accounts.getAccountUsers = accountsSpy;
    const { result } = renderHook(
      () => useFindAccountUsers('account-1', 2, 10),
      {
        wrapper: wrapperWithClients(fakeClient, new QueryClient()),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(accountsSpy).toBeCalledWith({
      id: 'account-1',
      page: 2,
      size: 10,
    });
  });

  it('adds trial user', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createTrialUserSpy = jest.spyOn(fakeClient.users, 'createTrialUser');
    // @ts-ignore
    fakeClient.users.createTrialUser = createTrialUserSpy;
    const { result } = renderHook(() => useAddNewTrialUser(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    const request: CreateTrialUserRequest = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss',
      type: CreationUserType.trialB2bUser,
    };

    act(() => result.current.mutate(request));

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(createTrialUserSpy).toBeCalledWith(request);
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
    const { result } = renderHook(() => useUpdateUser(), {
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

    act(() =>
      result.current.mutate({
        user: accountUser,
        request,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(usersSpy).toBeCalledWith('user-1', request);
  });
});
