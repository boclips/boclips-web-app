import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import { UpdateAccountRequest } from 'boclips-api-client/dist/sub-clients/accounts/model/UpdateAccountRequest';
import {
  AccountStatus,
  AccountType,
  MarketSegment,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { DeliveryMethod } from 'boclips-api-client/dist/sub-clients/common/model/DeliveryMethod';
import { useUpdateAccount } from 'src/hooks/api/accountQuery';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('accountQuery', () => {
  it('updates an account', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1' }),
    );
    const updateUserAccountSpy = vi.spyOn(
      fakeClient.accounts,
      'updateUserAccount',
    );

    const request: UpdateAccountRequest = {
      name: 'New name',
      manager: 'Greg',
      status: AccountStatus.ARCHIVED,
      type: AccountType.STANDARD,
      marketSegment: MarketSegment.HIGHER_EDUCATION,
      deliveryMethod: DeliveryMethod.EMBED,
      defaultLicenseDurationYears: 3,
      currency: 'EUR',
      features: {},
      companySegments: ['Edtech'],
    };
    const { result } = renderHook(() => useUpdateAccount(), {
      wrapper: wrapperWithClients(fakeClient, new QueryClient()),
    });

    const user = UserFactory.sample({
      account: { ...UserFactory.sample().account, id: 'account-1' },
    });
    act(() =>
      result.current.mutate({
        user,
        request,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(updateUserAccountSpy).toBeCalledWith(user, request);
  });
});
