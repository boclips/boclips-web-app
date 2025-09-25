import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { act, renderHook, waitFor } from '@testing-library/react';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import {
  useAccountBulkGetUsers,
  useAddNewClassroomUser,
  useAddNewTrialUser,
  useFindAccountUsers,
  useUpdateUser,
} from 'src/hooks/api/userQuery';
import { UpdateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import {
  CreateClassroomUserRequest,
  CreateTrialUserRequest,
  UserType,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';

describe('userQuery', () => {
  it('finds the account users', async () => {
    const fakeClient = new FakeBoclipsClient();
    const accountsSpy = jest.spyOn(fakeClient.accounts, 'getAccountUsers');

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

  it('finds the account users matching email query', async () => {
    const fakeClient = new FakeBoclipsClient();
    const accountsSpy = jest.spyOn(fakeClient.accounts, 'getAccountUsers');

    const { result } = renderHook(
      () => useFindAccountUsers('account-1', 2, 10, 'blah@boclips.com'),
      {
        wrapper: wrapperWithClients(fakeClient, new QueryClient()),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(accountsSpy).toBeCalledWith({
      id: 'account-1',
      emailQuery: 'blah@boclips.com',
      page: 2,
      size: 10,
    });
  });

  it('bulk gets account users', async () => {
    const fakeClient = new FakeBoclipsClient();
    const accountsSpy = jest.spyOn(fakeClient.accounts, 'getAccountBulkUsers');

    const { result } = renderHook(
      () => useAccountBulkGetUsers('account-1', ['user-1', 'user-99']),
      {
        wrapper: wrapperWithClients(fakeClient, new QueryClient()),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(accountsSpy).toBeCalledWith('account-1', {
      userIds: ['user-1', 'user-99'],
    });
  });

  it('adds trial user', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createTrialUserSpy = jest.spyOn(fakeClient.users, 'createTrialUser');

    const { result } = renderHook(() => useAddNewTrialUser(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    const request: CreateTrialUserRequest = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss',
      type: UserType.trialB2bUser,
      accountName: 'Los Angeles Lakers',
      hasAcceptedEducationalUseTerms: true,
      country: 'country',
      hasAcceptedTermsAndConditions: true,
    };

    act(() => result.current.mutate(request));

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(createTrialUserSpy).toBeCalledWith(request);
  });

  it('adds classroom user', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createClassroomUserSpy = jest.spyOn(
      fakeClient.users,
      'createClassroomUser',
    );

    const { result } = renderHook(() => useAddNewClassroomUser(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    const request: CreateClassroomUserRequest = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss',
      type: UserType.classroomUser,
      schoolName: 'Los Angeles Lakers',
      hasAcceptedEducationalUseTerms: true,
      country: 'country',
      state: 'state',
      hasAcceptedTermsAndConditions: true,
    };

    act(() => result.current.mutate(request));

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(createClassroomUserSpy).toBeCalledWith(request);
  });

  it('updates a user', async () => {
    const fakeClient = new FakeBoclipsClient();
    const usersSpy = jest.spyOn(fakeClient.users, 'updateUser');

    const request: UpdateUserRequest = {
      userRoles: {
        LIBRARY: UserRole.ADMIN,
        CLASSROOM: UserRole.ADMIN,
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
      userRoles: {
        LIBRARY: UserRole.ADMIN,
        CLASSROOM: UserRole.ADMIN,
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

  it('updates _self user', async () => {
    const fakeClient = new FakeBoclipsClient();
    const usersSpy = jest.spyOn(fakeClient.users, 'updateUser');

    const request: UpdateUserRequest = {
      jobTitle: 'test',
    };
    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    const accountUser: AccountUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'bla@boclips.com',
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
