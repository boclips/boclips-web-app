import { render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { ROLES } from 'src/types/Roles';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import EditTeamMemberModal from 'src/components/teamModal/EditTeamMemberModal';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Edit Team member modal', () => {
  const user: AccountUser = {
    id: 'user-id-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johny@boclips.com',
    permissions: {
      canOrder: true,
      canManageUsers: false,
    },
  };

  it('renders teams modal', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <EditTeamMemberModal
              userToUpdate={user}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Edit user')).toBeVisible();
    expect(wrapper.getByText('First name')).toBeVisible();
    expect(wrapper.getByText('John')).toBeVisible();
    expect(wrapper.getByText('Last name')).toBeVisible();
    expect(wrapper.getByText('Doe')).toBeVisible();
    expect(wrapper.getByText('Email address')).toBeVisible();
    expect(wrapper.getByText('johny@boclips.com')).toBeVisible();

    const orderYes = await wrapper.findByLabelText('Can order videos? Yes');
    expect(orderYes).toBeChecked();
    const orderNo = wrapper.getByLabelText('Can order videos? No');
    expect(orderNo).not.toBeChecked();

    const manageUsersYes = wrapper.getByLabelText('Can manage team? Yes');
    expect(manageUsersYes).not.toBeChecked();
    const manageUsersNo = wrapper.getByLabelText('Can manage team? No');
    expect(manageUsersNo).toBeChecked();
  });

  it('cannot update ordering permission if admin cannot order themselves', async () => {
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (role) => role !== ROLES.BOCLIPS_WEB_APP_ORDER,
    };

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={security}>
            <EditTeamMemberModal
              userToUpdate={user}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Team member actions')).toBeVisible();
    expect(wrapper.queryByText('Can order videos?')).toBeNull();
    expect(wrapper.getByText('Can manage team?')).toBeVisible();
  });

  it('updates a user', async () => {
    const client = new FakeBoclipsClient();
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (role) => role === ROLES.BOCLIPS_WEB_APP_ORDER,
    };

    client.users.updateUser = jest.fn();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'best-account',
          name: 'simply the best',
          type: AccountType.STANDARD,
        },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={security}>
            <EditTeamMemberModal
              userToUpdate={user}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    await userEvent.click(wrapper.getByLabelText('Can manage team? Yes'));
    await userEvent.click(wrapper.getByLabelText('Can order videos? No'));

    await userEvent.click(wrapper.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(client.users.updateUser).toHaveBeenCalledWith('user-id-123', {
        permissions: {
          canOrder: false,
          canManageUsers: true,
        },
      }),
    );
  });
});
