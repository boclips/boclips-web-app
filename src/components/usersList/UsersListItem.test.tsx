import React from 'react';
import { render, within } from '@testing-library/react';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';
import { AccountUserStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('UsersListRow', () => {
  it('says the user can place orders if the permissions allow that', () => {
    const user: AccountUser = {
      id: 'id-1',
      email: 'joebiden@gmail.com',
      firstName: 'Joe',
      lastName: 'Biden',
      permission: AccountUserStatus.CAN_ORDER,
      permissions: {
        ordering: [],
        userManagement: [],
      },
    };

    const component = render(<UsersListItem user={user} />);

    expect(
      within(component.getByTestId('user-info-field-Can order')).getByText(
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
      permission: AccountUserStatus.VIEW_ONLY,
      permissions: {
        ordering: [],
        userManagement: [],
      },
    };

    const component = render(<UsersListItem user={user} />);

    expect(
      within(component.getByTestId('user-info-field-Can order')).getByText(
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
      permission: AccountUserStatus.VIEW_ONLY,
      permissions: {
        ordering: [],
        userManagement: [],
      },
    };

    const wrapper = render(<UsersListItem user={user} isLoading />);

    expect(wrapper.getByTestId('skeleton')).toBeVisible();
  });
});
