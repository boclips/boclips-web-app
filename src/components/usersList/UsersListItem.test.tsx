import React from 'react';
import { render, within } from '@testing-library/react';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

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

  it('displays edit button when can manage users and has roles', () => {
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => true,
    };

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

    const wrapper = renderWrapper(user, jest.fn(), true, security);

    expect(wrapper.getByText('Edit')).toBeVisible();
  });

  it('doesnt display `Can order videos` column when account status is TRIAL', async () => {
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => true,
    };

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

    const wrapper = renderWrapper(
      user,
      jest.fn(),
      true,
      security,
      AccountStatus.TRIAL,
    );

    expect(
      await wrapper.queryByText('Can order videos'),
    ).not.toBeInTheDocument();
  });

  const renderWrapper = (
    user,
    onEdit,
    canEdit,
    security: BoclipsSecurity = stubBoclipsSecurity,
    accountStatus = AccountStatus.ACTIVE,
  ) => {
    const client = new FakeBoclipsClient();

    return render(
      <BoclipsSecurityProvider boclipsSecurity={security}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <UsersListItem
              user={user}
              isLoading
              onEdit={onEdit}
              canEdit={canEdit}
              accountStatus={accountStatus}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );
  };
});
