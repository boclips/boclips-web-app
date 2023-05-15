import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { AccountUserStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('My Team view', () => {
  it('renders my team page', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('My team')).toBeInTheDocument();
    expect(
      wrapper.getByRole('button', { name: 'Add new user' }),
    ).toBeInTheDocument();
  });

  it('creates an account', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Add new user' }),
    );

    await waitFor(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Add new user' }),
    );

    await userEvent.type(wrapper.getByPlaceholderText('John'), 'Andrzej');
    await userEvent.type(wrapper.getByPlaceholderText('Smith'), 'Duda');
    await userEvent.type(
      wrapper.getByPlaceholderText('example@email.com'),
      'dudu@wp.pl',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(
        wrapper.getByText('User created successfully'),
      ).toBeInTheDocument(),
    );
  });

  it('lists the users with expected table headers', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1' }),
    );
    const joe = await fakeClient.users.createUser({
      firstName: 'Joe',
      lastName: 'Biden',
      email: 'joebiden@gmail.com',
      accountId: 'account-1',
      type: UserType.b2bUser,
    });
    fakeClient.users.setPermissionOfUser(joe.id, AccountUserStatus.CAN_ORDER);

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('User')).toBeVisible();
    expect(await wrapper.findByText('Joe Biden')).toBeVisible();
    expect(await wrapper.findByText('User email')).toBeVisible();
    expect(await wrapper.findByText('joebiden@gmail.com')).toBeVisible();
    expect(await wrapper.findByText('Can order')).toBeVisible();
    expect(await wrapper.findByText('Yes')).toBeVisible();
    expect(await wrapper.findByText('Can add users')).toBeVisible();
    expect(await wrapper.findByText('No')).toBeVisible();
  });
});
