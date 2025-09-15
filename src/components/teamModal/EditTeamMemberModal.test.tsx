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
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';

describe('Edit Team member modal', () => {
  const user: AccountUser = {
    id: 'user-id-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johny@boclips.com',
    userRoles: {
      [Product.LIBRARY]: UserRole.ADMIN,
    },
  };

  it('renders teams modal', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <EditTeamMemberModal
              userToUpdate={user}
              product={Product.LIBRARY}
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
    expect(wrapper.getByText('User role')).toBeVisible();

    const viewer = wrapper.getByLabelText('Viewer');
    expect(viewer).not.toBeChecked();
    const admin = await wrapper.findByLabelText('Admin');
    expect(admin).toBeChecked();
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
              product={Product.LIBRARY}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByLabelText('Admin')).toBeVisible();
    await userEvent.click(wrapper.getByLabelText('Admin'));

    await userEvent.click(wrapper.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(client.users.updateUser).toHaveBeenCalledWith('user-id-123', {
        userRoles: {
          [Product.LIBRARY]: UserRole.ADMIN,
        },
      }),
    );
  });
});
