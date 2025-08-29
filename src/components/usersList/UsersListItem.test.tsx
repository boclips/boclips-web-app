import React from 'react';
import { render, within } from '@testing-library/react';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UserRole } from 'boclips-api-client/dist/sub-clients/users/model/UserRole';

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
      permissions: {
        canOrder: true,
        canManageUsers: false,
      },
    };

    const wrapper = renderWrapper(user, jest.fn, false);

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
      permissions: {
        canOrder: false,
        canManageUsers: false,
      },
    };

    const wrapper = renderWrapper(user, jest.fn, false);

    expect(wrapper.getByTestId('skeleton')).toBeVisible();
  });

  it('displays edit button when "updateUser" link is present', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      permissions: {
        canOrder: false,
        canManageUsers: true,
      },
    };

    const client = new FakeBoclipsClient();
    expect(client.links.updateUser).not.toBeNull();

    const wrapper = renderWrapper(user, jest.fn(), true);

    expect(await wrapper.findByText('Edit')).toBeVisible();
  });

  it('displays remove button when "deleteUser" links is present', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      permissions: {
        canOrder: false,
        canManageUsers: true,
      },
    };

    const client = new FakeBoclipsClient();
    expect(client.links.deleteUser).not.toBeNull();

    const wrapper = renderWrapper(user, jest.fn(), true);

    expect(await wrapper.findByText('Remove')).toBeVisible();
  });

  it('doesnt display `Can order videos` column when flag is unset', async () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      permissions: {
        canOrder: false,
        canManageUsers: true,
      },
    };

    const wrapper = renderWrapper(user, jest.fn(), true);

    expect(wrapper.queryByText('Can order videos')).not.toBeInTheDocument();
  });

  it('doesnt display ui elements if user doesnt have necessary links', () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      permissions: {
        canOrder: false,
        canManageUsers: true,
      },
    };

    const client = new FakeBoclipsClient();
    delete client.links.deleteUser;
    delete client.links.updateUser;

    const wrapper = renderWrapper(user, jest.fn(), true, client);

    expect(wrapper.queryByText('Remove')).toBeNull();
    expect(wrapper.queryByText('Edit')).toBeNull();
  });

  const renderWrapper = (
    user: AccountUser,
    onEdit: (user: AccountUser) => void,
    canEdit: boolean,
    client = new FakeBoclipsClient(),
  ) => {
    return render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <UsersListItem
            user={user}
            product={Product.LIBRARY}
            isLoading
            onEdit={onEdit}
            canEdit={canEdit}
            onRemove={() => {}}
            canRemove
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );
  };
});
