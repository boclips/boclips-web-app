import React from 'react';
import { render, within } from '@testing-library/react';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';
import { BoclipsClient } from 'boclips-api-client';

describe('UsersListRow', () => {
  it('shows user role', () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.ADMIN,
      },
    };

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: false,
    });

    expect(
      within(wrapper.getByTestId('user-info-field-Role')).getByText('Admin'),
    ).toBeVisible();
  });

  it('displays skeleton when loading list items', () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.VIEWER,
      },
    };

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: false,
    });

    expect(wrapper.getByTestId('skeleton')).toBeVisible();
  });

  it('displays edit button when "updateUser" link is present', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.ADMIN,
      },
    };

    const client = new FakeBoclipsClient();
    expect(client.links.updateUser).not.toBeNull();

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
    });

    expect(await wrapper.findByText('Edit')).toBeVisible();
  });

  it('displays remove button when "deleteUser" links is present', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.ADMIN,
      },
    };

    const client = new FakeBoclipsClient();
    expect(client.links.deleteUser).not.toBeNull();

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
    });

    expect(await wrapper.findByText('Remove')).toBeVisible();
  });

  it('doesnt display `Can order videos` column when flag is unset', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.VIEWER,
      },
    };

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
    });

    expect(wrapper.queryByText('Can order videos')).not.toBeInTheDocument();
  });

  it('doesnt display account column when flag is unset', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.VIEWER,
      },
    };

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
      displayAccount: false,
    });

    expect(wrapper.queryByText('Account')).not.toBeInTheDocument();
    expect(wrapper.queryByText('District/School')).not.toBeInTheDocument();
  });

  it('displays account column when flag is set with header "Account" when not classroom', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.VIEWER,
      },
      account: {
        name: 'Secret organisation',
        id: 'account-id',
      },
    };

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
      displayAccount: true,
      product: Product.LIBRARY,
    });

    expect(await wrapper.findByText('Account')).toBeVisible();
    expect(await wrapper.findByText('Secret organisation')).toBeVisible();

    expect(wrapper.queryByText('District/School')).not.toBeInTheDocument();
  });

  it('displays account column when flag is set with header "District/School" when classroom', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.VIEWER,
      },
      account: {
        name: 'Generic town elementary',
        id: 'account-id',
      },
    };

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
      displayAccount: true,
      product: Product.CLASSROOM,
    });

    expect(await wrapper.findByText('District/School')).toBeVisible();
    expect(await wrapper.findByText('Generic town elementary')).toBeVisible();

    expect(wrapper.queryByText('Account')).not.toBeInTheDocument();
  });

  it('doesnt display ui elements if user doesnt have necessary links', () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.VIEWER,
      },
    };

    const client = new FakeBoclipsClient();
    delete client.links.deleteUser;
    delete client.links.updateUser;

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
      client,
    });

    expect(wrapper.queryByText('Remove')).toBeNull();
    expect(wrapper.queryByText('Edit')).toBeNull();
  });

  it('displays icon only buttons when flag is set', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      userRoles: {
        [Product.LIBRARY]: UserRole.ADMIN,
      },
    };

    const client = new FakeBoclipsClient();
    expect(client.links.updateUser).not.toBeNull();

    const wrapper = renderWrapper({
      user,
      onEdit: jest.fn(),
      canEdit: true,
      iconOnlyButtons: true,
    });

    expect(await wrapper.findByRole('button', { name: 'Edit' })).toBeVisible();
    expect(
      await wrapper.findByRole('button', { name: 'Remove' }),
    ).toBeVisible();

    expect(wrapper.queryByText('Edit')).toBeNull();
    expect(wrapper.queryByText('Remove')).toBeNull();
  });

  interface RenderOptions {
    user: AccountUser;
    onEdit: (user: AccountUser) => void;
    canEdit: boolean;
    displayAccount?: boolean;
    product?: Product;
    client?: BoclipsClient;
    iconOnlyButtons?: boolean;
  }

  const renderWrapper = ({
    user,
    onEdit,
    canEdit,
    client = new FakeBoclipsClient(),
    product = Product.LIBRARY,
    displayAccount = false,
    iconOnlyButtons = false,
  }: RenderOptions) => {
    return render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <UsersListItem
            user={user}
            product={product}
            isLoading
            onEdit={onEdit}
            canEdit={canEdit}
            onRemove={() => {}}
            canRemove
            displayAccount={displayAccount}
            iconOnlyButtons={iconOnlyButtons}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );
  };
});
