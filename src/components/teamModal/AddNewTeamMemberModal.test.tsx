import { render, waitFor } from '@testing-library/react';
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

describe('My Team modal', () => {
  it('renders teams modal', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <AddNewTeamMemberModal closeModal={() => jest.fn()} />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Add new user')).toBeInTheDocument();
    expect(wrapper.getByText('First name')).toBeInTheDocument();
    expect(wrapper.getByText('Last name')).toBeInTheDocument();
    expect(wrapper.getByText('Email address')).toBeInTheDocument();
  });

  it('creates an account', async () => {
    const client = new FakeBoclipsClient();
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (role) => role === ROLES.BOCLIPS_WEB_APP_ORDER,
    };

    client.users.createUser = jest.fn();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'best-account', name: 'simply the best' },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={security}>
            <AddNewTeamMemberModal closeModal={() => jest.fn()} />
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
    await userEvent.click(wrapper.getByLabelText('Yes'));

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(client.users.createUser).toHaveBeenCalledWith({
        firstName: 'Andrzej',
        lastName: 'Duda',
        email: 'dudu@wp.pl',
        accountId: 'best-account',
        type: UserType.b2bUser,
        permissions: {
          canOrder: true,
        },
      }),
    );
  });

  it('validates the input fields', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <AddNewTeamMemberModal closeModal={() => jest.fn()} />
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

  describe('user permissions', () => {
    it(`doesn't show the can order field if user doesn't have ordering permission`, async () => {
      const client = new FakeBoclipsClient();
      const security: BoclipsSecurity = {
        ...stubBoclipsSecurity,
        hasRole: () => false,
      };

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={security}>
              <AddNewTeamMemberModal closeModal={() => jest.fn()} />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(
        await wrapper.queryByText('User permissions:'),
      ).not.toBeInTheDocument();
      expect(await wrapper.queryByText('Can order?')).not.toBeInTheDocument();
    });

    it(`shows the can order field if user has ordering permission`, async () => {
      const client = new FakeBoclipsClient();
      const security: BoclipsSecurity = {
        ...stubBoclipsSecurity,
        hasRole: (role) => role === ROLES.BOCLIPS_WEB_APP_ORDER,
      };

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={security}>
              <AddNewTeamMemberModal closeModal={() => jest.fn()} />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await wrapper.queryByText('User permissions:')).toBeVisible();
      expect(await wrapper.queryByText('Can order?')).toBeVisible();
    });
  });
});
