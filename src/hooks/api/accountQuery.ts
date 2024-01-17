import { BoclipsClient } from 'boclips-api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Account } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UpdateAccountRequest } from 'boclips-api-client/dist/sub-clients/accounts/model/UpdateAccountRequest';

export type EditAccountRequest = {
  accountId: string;
  request: UpdateAccountRequest;
};

export const useUpdateAccount = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    ({ accountId, request }: EditAccountRequest) =>
      doUpdateAccount(accountId, request, client),
    {
      onSuccess: () => {
        // do not wait until query cache is invalidated!
        // noinspection JSIgnoredPromiseFromCall
        queryClient.invalidateQueries(['account']);
      },
    },
  );
};

const doUpdateAccount = (
  userId: string,
  updateRequest: UpdateAccountRequest,
  client: BoclipsClient,
): Promise<Account> => {
  return client.accounts.updateAccount(userId, updateRequest);
};
