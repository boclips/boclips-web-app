import React from 'react';
import { render, within } from '@testing-library/react';
import { UsersListItem } from '@components/usersList/UsersListItem';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('UsersListRow', () => {
  it('says the user can place orders if the permissions allow that', () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      permissions: {
        canOrder: true,
        canManageUsers: false,
      },
    };

    const wrapper = renderWrapper(user, jest.fn, false);

    expect(
      within(wrapper.getByTestId('user-info-field-Can order videos')).getByText(
        'Yes',
      ),
    ).toBeVisible();
  });

  it('says the user cannot place orders if the permissions do not allow that', () => {
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

    expect(
      within(wrapper.getByTestId('user-info-field-Can order videos')).getByText(
        'No',
      ),
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

  it('doesnt display `Can order videos` column when account type is TRIAL', async () => {
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

    const wrapper = renderWrapper(user, jest.fn(), true, AccountType.TRIAL);

    expect(
      await wrapper.queryByText('Can order videos'),
    ).not.toBeInTheDocument();
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

    const wrapper = renderWrapper(
      user,
      jest.fn(),
      true,
      AccountType.TRIAL,
      client,
    );

    expect(wrapper.queryByText('Remove')).toBeNull();
    expect(wrapper.queryByText('Edit')).toBeNull();
  });

  const renderWrapper = (
    user,
    onEdit,
    canEdit,
    accountType = AccountType.STANDARD,
    client = new FakeBoclipsClient(),
  ) => {
    return render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <UsersListItem
            user={user}
            isLoading
            onEdit={onEdit}
            canEdit={canEdit}
            onRemove={() => {}}
            canRemove
            accountType={accountType}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );
  };
});
