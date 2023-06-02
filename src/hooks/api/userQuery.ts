import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { CreateUserRequest } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';

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

export const doFindAccountUsers = (
  accountId: string,
  client: BoclipsClient,
) => {
  return client.accounts.getAccountUsers(accountId);
};

export const useFindAccountUsers = (accountId: string) => {
  const client = useBoclipsClient();

  return useQuery(
    ['accountUsers', accountId],
    () => doFindAccountUsers(accountId, client),
    {
      enabled: !!accountId,
    },
  );
};
