import { render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import EditPersonalProfileModal from 'src/views/profile/EditPersonalProfileModal';

describe('Edit Personal Profile modal', () => {
  const user: User = {
    email: 'v@doe.com',
    organisation: { id: 'org-1', name: '' },
    id: 'user-id-123',
    firstName: 'Vincent',
    lastName: 'Doe',
  };

  it('renders personal profile edit modal', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <EditPersonalProfileModal
              userToUpdate={user}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Edit Personal Profile')).toBeVisible();
    expect(wrapper.getByText('First name')).toBeVisible();
    expect(wrapper.getByDisplayValue('Vincent')).toBeVisible();
    expect(wrapper.getByText('Last name')).toBeVisible();
    expect(wrapper.getByDisplayValue('Doe')).toBeVisible();
  });

  it('updates the user', async () => {
    const client = new FakeBoclipsClient();
    client.users.updateSelf = jest.fn();

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <EditPersonalProfileModal
              userToUpdate={user}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    const firstNameInput = wrapper.getByDisplayValue('Vincent');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Andrzej');

    const lastNameInput = wrapper.getByDisplayValue('Doe');
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'Moussa');

    await userEvent.click(wrapper.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(client.users.updateSelf).toHaveBeenCalledWith(user, {
        firstName: 'Andrzej',
        lastName: 'Moussa',
        type: UserType.b2bUser,
      }),
    );
  });

  it('validates the input fields', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <EditPersonalProfileModal
              userToUpdate={user}
              closeModal={() => jest.fn()}
            />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    const firstNameInput = wrapper.getByDisplayValue('Vincent');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'A');

    const lastNameInput = wrapper.getByDisplayValue('Doe');
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'M');

    await userEvent.click(wrapper.getByRole('button', { name: 'Save' }));

    expect(
      wrapper.getByText(
        'Please enter a valid first name (2 characters or longer)',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Please enter a valid last name (2 characters or longer)',
      ),
    ).toBeInTheDocument();
  });
});
