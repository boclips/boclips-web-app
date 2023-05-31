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
    fakeClient.users.setPermissionsOfUser(joe.id, {
      canOrder: true,
      canManageUsers: false,
    });

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

  it('list of users is only available only if `accountUsers` link is present', async () => {
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

    fakeClient.users.setPermissionsOfUser(joe.id, {
      canOrder: true,
      canManageUsers: false,
    });

    delete fakeClient.links.accountUsers;

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.queryByText('User')).not.toBeInTheDocument();
    expect(await wrapper.queryByText('Joe Biden')).not.toBeInTheDocument();
    expect(await wrapper.queryByText('User email')).not.toBeInTheDocument();
    expect(
      await wrapper.queryByText('joebiden@gmail.com'),
    ).not.toBeInTheDocument();
    expect(await wrapper.queryByText('Can order')).not.toBeInTheDocument();
    expect(await wrapper.queryByText('Yes')).not.toBeInTheDocument();
    expect(await wrapper.queryByText('Can add users')).not.toBeInTheDocument();
    expect(await wrapper.queryByText('No')).not.toBeInTheDocument();
  });
});
