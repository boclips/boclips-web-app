import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import {
  CreateClassroomUserRequest,
  CreateDistrictUserRequest,
  CreateTrialUserRequest,
  CreateUserRequest,
} from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { UpdateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/UpdateUserRequest';
import { Account } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { AccountUserProfile } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUserProfile';

export const doGetUser = (client: BoclipsClient): Promise<User> => {
  return client.users.getCurrentUser();
};

export const useGetUserQuery = () => {
  const client = useBoclipsClient();
  return useQuery(['user'], async () => doGetUser(client));
};

export const doCreateNewUser = (
  request: CreateUserRequest,
  client: BoclipsClient,
): Promise<User> => {
  return client.users.createUser(request);
};

export const useGetAccount = (accountId: string) => {
  const client = useBoclipsClient();

  return useQuery(
    ['account', accountId],
    () => doGetAccount(client, accountId),
    {
      enabled: !!accountId,
    },
  );
};

export const useAddNewUser = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (userRequest: CreateUserRequest) => doCreateNewUser(userRequest, client),
    {
      onSuccess: () => {
        // do not wait until query cache is invalidated!
        // noinspection JSIgnoredPromiseFromCall
        queryClient.invalidateQueries(['accountUsers']);
      },
    },
  );
};

export const useAddNewClassroomUser = () => {
  const client = useBoclipsClient();

  return useMutation((userRequest: CreateClassroomUserRequest) =>
    client.users.createClassroomUser(userRequest),
  );
};

export const useAddNewDistrictUser = () => {
  const client = useBoclipsClient();

  return useMutation((userRequest: CreateDistrictUserRequest) =>
    client.users.createDistrictUser(userRequest),
  );
};

export const useAddNewTrialUser = () => {
  const client = useBoclipsClient();

  return useMutation((userRequest: CreateTrialUserRequest) =>
    client.users.createTrialUser(userRequest),
  );
};

export type EditUserRequest = {
  user: AccountUser | User;
  request: UpdateUserRequest;
};

export const useUpdateUser = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    ({ user, request }: EditUserRequest) =>
      doUpdateUser(user.id, request, client),
    {
      onSuccess: (_isSuccess, _request) => {
        // do not wait until query cache is invalidated!
        // noinspection JSIgnoredPromiseFromCall
        queryClient.invalidateQueries(['accountUsers']);
        queryClient.invalidateQueries(['user']);
      },
    },
  );
};

const doUpdateUser = (
  userId: string,
  updateRequest: UpdateUserRequest,
  client: BoclipsClient,
): Promise<boolean> => {
  return client.users.updateUser(userId, updateRequest);
};

const doUpdateSelfUser = (
  user: Partial<User>,
  updateRequest: UpdateUserRequest,
  client: BoclipsClient,
): Promise<User> => {
  return client.users.updateSelf(user, updateRequest);
};

export const useUpdateSelfUser = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    ({ user, request }: EditUserRequest) =>
      doUpdateSelfUser(user as Partial<User>, request, client),
    {
      onSuccess: (_isSuccess, _request) => {
        // do not wait until query cache is invalidated!
        // noinspection JSIgnoredPromiseFromCall
        queryClient.invalidateQueries(['accountUsers']);
        queryClient.invalidateQueries(['user']);
      },
    },
  );
};

const doFindAccountUsers = (
  client: BoclipsClient,
  accountId: string,
  page: number,
  size: number,
): Promise<Pageable<AccountUser>> => {
  return client.accounts.getAccountUsers({ id: accountId, page, size });
};

const doAccountBulkGetUsers = (
  client: BoclipsClient,
  accountId: string,
  userIds: string[],
): Promise<AccountUserProfile[]> => {
  return client.accounts.getAccountBulkUsers(accountId, { userIds });
};

const doGetAccount = (
  client: BoclipsClient,
  accountId: string,
): Promise<Account> => {
  return client.accounts.getAccount(accountId);
};

export const useFindAccountUsers = (
  accountId: string,
  page: number,
  size: number,
) => {
  const client = useBoclipsClient();

  return useQuery(
    ['accountUsers', accountId, page],
    () => doFindAccountUsers(client, accountId, page, size),
    {
      enabled: !!accountId,
    },
  );
};

export const useAccountBulkGetUsers = (
  accountId: string,
  userIds: string[],
) => {
  const client = useBoclipsClient();

  return useQuery(
    ['accountBulkUsers', accountId, userIds],
    () => doAccountBulkGetUsers(client, accountId, userIds),
    {
      enabled: !!accountId,
    },
  );
};
