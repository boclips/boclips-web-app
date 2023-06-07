import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { CreateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';

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

export const useAddNewUser = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (userRequest: CreateUserRequest) => doCreateNewUser(userRequest, client),
    {
      onSuccess: (user: User) => {
        // do not wait until query cache is invalidated!
        // noinspection JSIgnoredPromiseFromCall
        queryClient.invalidateQueries(['accountUsers', user.account.id]);
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
