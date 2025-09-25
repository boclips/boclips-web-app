import { fireEvent, render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import AddNewTeamMemberModal from 'src/components/teamModal/AddNewTeamMemberModal';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { ROLES } from 'src/types/Roles';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';

describe('Team modal', () => {
  it('renders teams modal', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <AddNewTeamMemberModal
              product={Product.LIBRARY}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Add member')).toBeInTheDocument();
    expect(wrapper.getByText('First name')).toBeInTheDocument();
    expect(wrapper.getByText('Last name')).toBeInTheDocument();
    expect(wrapper.getByText('Email address')).toBeInTheDocument();
  });

  it('creates a user', async () => {
    const client = new FakeBoclipsClient();
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (role) => role === ROLES.BOCLIPS_WEB_APP_ORDER,
    };

    client.users.createUser = jest.fn();
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
            <AddNewTeamMemberModal
              product={Product.LIBRARY}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    await userEvent.type(wrapper.getByPlaceholderText('John'), 'Andrzej');
    await userEvent.type(wrapper.getByPlaceholderText('Smith'), 'Duda');
    await userEvent.type(
      wrapper.getByPlaceholderText('example@email.com'),
      'dudu@wp.pl',
    );
    await userEvent.click(wrapper.getByLabelText('Order Manager'));

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(client.users.createUser).toHaveBeenCalledWith({
        firstName: 'Andrzej',
        lastName: 'Duda',
        email: 'dudu@wp.pl',
        accountId: 'best-account',
        type: UserType.webAppUser,
        userRoles: {
          [Product.LIBRARY]: UserRole.ORDER_MANAGER,
        },
      }),
    );
  });

  it('validates the input fields', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <AddNewTeamMemberModal
              product={Product.LIBRARY}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    await userEvent.type(wrapper.getByPlaceholderText('John'), 'A');
    await userEvent.type(wrapper.getByPlaceholderText('Smith'), 'D');
    await userEvent.type(
      wrapper.getByPlaceholderText('example@email.com'),
      'd',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    expect(
      wrapper.getByText(
        'Please enter a valid first name (2 characters or longer)',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Please enter a valid last name (2 characters or longer)',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText('Please enter a valid email address'),
    ).toBeInTheDocument();
  });

  describe('Team member actions', () => {
    it(`shows the user role section`, async () => {
      const client = new FakeBoclipsClient();
      const security: BoclipsSecurity = {
        ...stubBoclipsSecurity,
        hasRole: () => false,
      };

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={security}>
              <AddNewTeamMemberModal
                product={Product.LIBRARY}
                closeModal={() => jest.fn()}
              />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await wrapper.queryByText('User role')).toBeInTheDocument();
    });

    it(`show appropriate classroom roles`, async () => {
      const client = new FakeBoclipsClient();
      const security: BoclipsSecurity = {
        ...stubBoclipsSecurity,
        hasRole: () => false,
      };

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={security}>
              <AddNewTeamMemberModal
                product={Product.CLASSROOM}
                closeModal={() => jest.fn()}
              />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await wrapper.getByLabelText('Admin')).toBeVisible();
      expect(await wrapper.getByLabelText('Teacher')).toBeVisible();
      expect(await wrapper.getByLabelText('Student')).toBeVisible();
      expect(await wrapper.queryByText('Viewer')).toBeNull();
    });

    it(`shows library specific user roles`, async () => {
      const client = new FakeBoclipsClient();

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <AddNewTeamMemberModal
                product={Product.LIBRARY}
                closeModal={() => jest.fn()}
              />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await wrapper.getByLabelText('Admin')).toBeVisible();
      expect(await wrapper.getByLabelText('Viewer')).toBeVisible();
      expect(await wrapper.getByLabelText('Order Manager')).toBeVisible();
      expect(await wrapper.queryByText('Teacher')).toBeNull();
    });
  });

  describe('Team member account', () => {
    it(`shows account dropdown when sub-accounts are present`, async () => {
      const client = new FakeBoclipsClient();
      const user = UserFactory.sample();
      const account = AccountsFactory.sample({
        id: user.account.id,
        name: 'Best district',
        subAccounts: [
          { id: 'sub-1', name: 'Best School Ever' },
          { id: 'sub-2', name: 'Second Best School Ever' },
        ],
      });
      client.users.insertCurrentUser({
        ...user,
        account: {
          id: account.id,
          name: account.name,
          type: account.type,
          createdAt: account.createdAt,
          subAccounts: account.subAccounts,
        },
      });

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider
              boclipsSecurity={{
                ...stubBoclipsSecurity,
                hasRole: () => false,
              }}
            >
              <AddNewTeamMemberModal
                product={Product.CLASSROOM}
                closeModal={() => jest.fn()}
              />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await wrapper.findByText('School/District')).toBeVisible();
      const dropdown = await wrapper.findByText('Select school/district');

      fireEvent.click(dropdown);

      expect(wrapper.getByText('Best School Ever')).toBeVisible();
      expect(wrapper.getByText('Second Best School Ever')).toBeVisible();
      expect(wrapper.getByText('Best district')).toBeVisible();
    });
  });
});
