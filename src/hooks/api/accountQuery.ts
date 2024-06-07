import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Account } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UpdateAccountRequest } from 'boclips-api-client/dist/sub-clients/accounts/model/UpdateAccountRequest';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';

export type EditAccountRequest = {
  user: User;
  request: UpdateAccountRequest;
};

export const useUpdateAccount = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    ({ user, request }: EditAccountRequest) =>
      doUpdateUserAccount(user, request, client),
    {
      onSuccess: () => {
        // do not wait until query cache is invalidated!
        // noinspection JSIgnoredPromiseFromCall
        queryClient.invalidateQueries(['account']);
      },
    },
  );
};

const doUpdateUserAccount = (
  user: User,
  updateRequest: UpdateAccountRequest,
  client: BoclipsClient,
): Promise<Account> => {
  return client.accounts.updateUserAccount(user, updateRequest);
};
