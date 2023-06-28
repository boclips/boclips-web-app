import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

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

    expect(within(modal).getByLabelText('Can manage users? No')).toBeVisible();
    expect(within(modal).getByLabelText('Can order? Yes')).toBeVisible();
    expect(within(modal).getByRole('button', { name: 'Save' })).toBeVisible();
    expect(within(modal).getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  it('can edit user permissions', async () => {
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
      'user-info-field-Can order',
    );
    const originalManagingPermission = await wrapper.findByTestId(
      'user-info-field-Can add users',
    );
    expect(within(originalOrderingPermission).getByText('No')).toBeVisible();
    expect(within(originalManagingPermission).getByText('Yes')).toBeVisible();

    const editButton = wrapper.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeVisible();
    fireEvent.click(editButton);

    await waitFor(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Edit user' }),
    );

    await userEvent.click(wrapper.getByLabelText('Can order? Yes'));
    await userEvent.click(wrapper.getByLabelText('Can manage users? No'));

    fireEvent.click(wrapper.getByRole('button', { name: 'Save' }));

    await waitForElementToBeRemoved(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Edit user' }),
    );

    const newPermissions = fakeClient.users.getPermissionsOfUser(joe.id);
    expect(newPermissions.canOrder).toEqual(true);
    expect(newPermissions.canManageUsers).toEqual(false);

    const newOrderPermission = await wrapper.findByTestId(
      'user-info-field-Can order',
    );
    const newManagingPermission = await wrapper.findByTestId(
      'user-info-field-Can add users',
    );
    expect(within(newOrderPermission).getByText('Yes')).toBeVisible();
    expect(within(newManagingPermission).getByText('No')).toBeVisible();
  });
});
