import React from 'react';
import { render, within } from '@testing-library/react';
import { UsersListItem } from 'src/components/usersList/UsersListItem';
import { AccountUser } from 'boclips-api-client/dist/sub-clients/accounts/model/AccountUser';

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

    const component = render(<UsersListItem user={user} onEdit={jest.fn} />);

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
      permissions: {
        canOrder: false,
        canManageUsers: false,
      },
    };

    const component = render(<UsersListItem user={user} onEdit={jest.fn} />);

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
      permissions: {
        canOrder: false,
        canManageUsers: false,
      },
    };

    const wrapper = render(
      <UsersListItem user={user} isLoading onEdit={jest.fn} />,
    );

    expect(wrapper.getByTestId('skeleton')).toBeVisible();
  });
});
