import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
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
) => {
  return client.users.createUser(request);
};

export const useAddNewUser = (successNotification, errorNotification) => {
  const client = useBoclipsClient();

  return useMutation(
    (userRequest: CreateUserRequest) => doCreateNewUser(userRequest, client),
    {
      onSuccess: (userRequest) => {
        successNotification(userRequest);
      },
      onError: (userRequest: User) => {
        errorNotification(userRequest);
      },
    },
  );
};
