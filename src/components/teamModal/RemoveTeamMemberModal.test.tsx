import { render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { RemoveTeamMemberModal } from 'src/components/teamModal/RemoveTeamMemberModal';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Remove Team member modal', () => {
  const user: AccountUser = {
    id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johny@boclips.com',
    permissions: {
      canOrder: false,
      canManageUsers: false,
    },
  };

  it('renders Remove User modal', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <RemoveTeamMemberModal user={user} closeModal={() => jest.fn()} />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Remove user from Team Accounts')).toBeVisible();
    expect(
      wrapper.getByText('You are about to remove', { exact: false }),
    ).toBeVisible();
    expect(wrapper.getByText('John Doe')).toBeVisible();
    expect(wrapper.getByText('using', { exact: false })).toBeVisible();
    expect(wrapper.getByText('johny@boclips.com')).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'Yes, I confirm' }),
    ).toBeVisible();
  });

  it('removes a user', async () => {
    const client = new FakeBoclipsClient();
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => true,
    };

    client.users.updateUser = jest.fn();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'account-id',
          name: 'My Team Account',
          type: AccountType.STANDARD,
        },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={security}>
            <RemoveTeamMemberModal user={user} closeModal={() => jest.fn()} />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Yes, I confirm' }),
    );

    await waitFor(() =>
      expect(client.users.updateUser).toHaveBeenCalledWith('user-id', {
        type: UserType.b2bUser,
        disabled: true,
      }),
    );
  });
});
