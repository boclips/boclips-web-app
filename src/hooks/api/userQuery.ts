import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
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

export const useAddNewUser = () => {
  const client = useBoclipsClient();

  return useMutation(
    (userRequest: CreateUserRequest) => doCreateNewUser(userRequest, client),
    {
      onSuccess: (userRequest) => {
        displayNotification(
          'success',
          `User created successfully`,
          `Created a new user -- ${userRequest.firstName} ${userRequest.lastName}`,
          `user-created-${userRequest.id}`,
        );
      },
      onError: (userRequest: Collection) => {
        displayNotification(
          'error',
          `Failed to create user`,
          ``,
          `user-created-${userRequest.id}`,
        );
      },
    },
  );
};
