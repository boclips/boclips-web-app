import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@src/App';
import { createReactQueryClient } from '@src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { Helmet } from 'react-helmet';

describe('Team view', () => {
  it('renders Team page', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Team')).toBeInTheDocument();
    expect(
      wrapper.getByRole('button', { name: 'Add member' }),
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
      await wrapper.findByRole('button', { name: 'Add member' }),
    );

    await waitFor(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Add member' }),
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

    expect(await wrapper.findByText('Name')).toBeVisible();
    expect(await wrapper.findByText('Joe Biden')).toBeVisible();
    expect(await wrapper.findByText('Email address')).toBeVisible();
    expect(await wrapper.findByText('joebiden@gmail.com')).toBeVisible();
    expect(await wrapper.findByText('Can order videos')).toBeVisible();
    expect(await wrapper.findByText('Yes')).toBeVisible();
    expect(await wrapper.findByText('Can manage team')).toBeVisible();
    expect(await wrapper.findByText('No')).toBeVisible();
  });

  it('doesnt display the edit button only if `getAccount` link is absent', async () => {
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
      canManageUsers: true,
    });

    delete fakeClient.links.getAccount;

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.queryByRole('button', { name: 'Edit' }),
    ).not.toBeInTheDocument();
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

  it('user opens the edit modal when has permissions', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1', status: AccountStatus.ACTIVE }),
    );

    const joe = await fakeClient.users.createUser({
      firstName: 'Joe',
      lastName: 'Biden',
      email: 'joey@boclips.com',
      accountId: 'account-1',
      type: UserType.b2bUser,
      permissions: {
        canOrder: false,
        canManageUsers: true,
      },
    });

    await fakeClient.users.insertCurrentUser(joe);

    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => true,
    };

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={security}
        />
      </MemoryRouter>,
    );

    const editButton = await wrapper.findByRole('button', { name: 'Edit' });
    expect(editButton).toBeVisible();
    fireEvent.click(editButton);

    await waitFor(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Edit user' }),
    );

    const modal = wrapper.getByRole('dialog');

    expect(within(modal).getByText('First name')).toBeVisible();
    expect(within(modal).getByText('Joe')).toBeVisible();
    expect(within(modal).getByText('Last name')).toBeVisible();
    expect(within(modal).getByText('Biden')).toBeVisible();
    expect(within(modal).getByText('Email address')).toBeVisible();
    expect(within(modal).getByText('joey@boclips.com')).toBeVisible();

    expect(within(modal).getByLabelText('Can manage team? No')).toBeVisible();
    expect(within(modal).getByLabelText('Can order videos? Yes')).toBeVisible();
    expect(within(modal).getByRole('button', { name: 'Save' })).toBeVisible();
    expect(within(modal).getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  it('can edit Team member actions', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1' }),
    );
    const joe = await fakeClient.users.createUser({
      firstName: 'Joe',
      lastName: 'Biden',
      email: 'joey@boclips.com',
      accountId: 'account-1',
      type: UserType.b2bUser,
    });

    await fakeClient.users.insertCurrentUser(joe);

    fakeClient.users.setPermissionsOfUser(joe.id, {
      canOrder: false,
      canManageUsers: true,
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

    const originalOrderingPermission = await wrapper.findByTestId(
      'user-info-field-Can order videos',
    );
    const originalManagingPermission = await wrapper.findByTestId(
      'user-info-field-Can manage team',
    );
    expect(within(originalOrderingPermission).getByText('No')).toBeVisible();
    expect(within(originalManagingPermission).getByText('Yes')).toBeVisible();

    const editButton = wrapper.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeVisible();
    fireEvent.click(editButton);

    await waitFor(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Edit user' }),
    );

    await userEvent.click(wrapper.getByLabelText('Can order videos? Yes'));
    await userEvent.click(wrapper.getByLabelText('Can manage team? No'));

    fireEvent.click(wrapper.getByRole('button', { name: 'Save' }));

    await waitForElementToBeRemoved(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Edit user' }),
    );

    const newPermissions = fakeClient.users.getPermissionsOfUser(joe.id);
    expect(newPermissions.canOrder).toEqual(true);
    expect(newPermissions.canManageUsers).toEqual(false);

    const newOrderPermission = await wrapper.findByTestId(
      'user-info-field-Can order videos',
    );
    const newManagingPermission = await wrapper.findByTestId(
      'user-info-field-Can manage team',
    );
    expect(within(newOrderPermission).getByText('Yes')).toBeVisible();
    expect(within(newManagingPermission).getByText('No')).toBeVisible();
  });

  it('opens the remove user modal when user has permissions', async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1', status: AccountStatus.ACTIVE }),
    );

    const joe = await fakeClient.users.createUser({
      firstName: 'Joe',
      lastName: 'Biden',
      email: 'joey@boclips.com',
      accountId: 'account-1',
      type: UserType.b2bUser,
      permissions: {
        canOrder: false,
        canManageUsers: true,
      },
    });

    fakeClient.users.insertCurrentUser(joe);

    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => true,
    };

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={security}
        />
      </MemoryRouter>,
    );

    const removeButton = await wrapper.findByRole('button', { name: 'Remove' });
    expect(removeButton).toBeVisible();
    fireEvent.click(removeButton);

    await waitFor(() =>
      wrapper.getByRole('heading', {
        level: 1,
        name: 'Remove user from Team Accounts',
      }),
    );

    const modal = wrapper.getByRole('dialog');

    expect(
      within(modal).getByText('You are about to remove', { exact: false }),
    ).toBeVisible();
    expect(within(modal).getByText('Joe Biden')).toBeVisible();
    expect(within(modal).getByText('using', { exact: false })).toBeVisible();
    expect(within(modal).getByText('joey@boclips.com')).toBeVisible();
  });

  it('successfully removes a user', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1' }),
    );
    const joe = await fakeClient.users.createUser({
      firstName: 'Joe',
      lastName: 'Biden',
      email: 'joey@boclips.com',
      accountId: 'account-1',
      type: UserType.b2bUser,
    });

    fakeClient.users.insertCurrentUser(joe);

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Joe Biden')).toBeVisible();

    const removeButton = wrapper.getByRole('button', { name: 'Remove' });
    expect(removeButton).toBeVisible();
    fireEvent.click(removeButton);

    await waitFor(() =>
      wrapper.getByRole('heading', {
        level: 1,
        name: 'Remove user from Team Accounts',
      }),
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Yes, I confirm' }));

    await waitForElementToBeRemoved(() =>
      wrapper.getByRole('heading', {
        level: 1,
        name: 'Remove user from Team Accounts',
      }),
    );

    expect(
      await wrapper.findByTestId('user-removed-joey@boclips.com'),
    ).toBeVisible();
    expect(wrapper.queryByText('Joe Biden')).toBeNull();
  });

  it('fails to remove a user', async () => {
    const fakeClient = new FakeBoclipsClient();
    vi.spyOn(fakeClient.users, 'updateUser').mockImplementation(() =>
      Promise.reject(new Error('')),
    );

    fakeClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'account-1' }),
    );
    const joe = await fakeClient.users.createUser({
      firstName: 'Joe',
      lastName: 'Biden',
      email: 'joey@boclips.com',
      accountId: 'account-1',
      type: UserType.b2bUser,
    });

    fakeClient.users.insertCurrentUser(joe);

    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Joe Biden')).toBeVisible();

    const removeButton = wrapper.getByRole('button', { name: 'Remove' });
    expect(removeButton).toBeVisible();
    fireEvent.click(removeButton);

    await waitFor(() =>
      wrapper.getByRole('heading', {
        level: 1,
        name: 'Remove user from Team Accounts',
      }),
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Yes, I confirm' }));

    expect(
      await wrapper.findByTestId('user-removal-failed-joey@boclips.com'),
    ).toBeVisible();

    fireEvent.click(
      wrapper.getByRole('button', {
        name: 'Close Remove user from Team Accounts modal',
      }),
    );

    expect(await wrapper.findByText('Joe Biden')).toBeVisible();
  });

  it('displays Team as window title', async () => {
    render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('Team');
    });
  });
});
