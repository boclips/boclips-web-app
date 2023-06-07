import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
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

    await waitFor(() => expect(wrapper.queryByRole('dialog')).toBeNull());
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

  it('only lists the first 25 users and shows pagination at the bottom', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1' }),
    );

    for (let i = 0; i < 26; i++) {
      // eslint-disable-next-line no-await-in-loop
      await fakeClient.users.createUser({
        firstName: `Joe${i}`,
        lastName: 'Biden',
        email: `joebiden${i}@boclips.com`,
        accountId: 'account-1',
        type: UserType.b2bUser,
      });
    }

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Joe0 Biden')).toBeVisible();
    for (let i = 0; i < 25; i++) {
      expect(wrapper.getByText(`Joe${i} Biden`)).toBeVisible();
    }
    expect(wrapper.queryByText('Joe25 Biden')).toBeNull();

    expect(
      wrapper.getByRole('button', { name: 'Page 1 out of 2' }),
    ).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'Page 2 out of 2' }),
    ).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'go to next page' }),
    ).toBeVisible();
    expect(wrapper.queryByLabelText('go to previous page')).toBeNull();

    fireEvent.click(wrapper.getByLabelText('go to next page'));

    expect(await wrapper.findByText('Joe25 Biden')).toBeVisible();
    expect(wrapper.getByLabelText('go to previous page')).toBeVisible();

    expect(wrapper.queryByText('Joe0 Biden')).toBeNull();
    expect(wrapper.queryByText('Joe24 Biden')).toBeNull();
  });
});
