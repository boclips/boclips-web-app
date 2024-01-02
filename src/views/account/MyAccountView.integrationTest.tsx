import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { Account } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import userEvent from '@testing-library/user-event';

describe('My Account view', () => {
  const boclipsClient = new FakeBoclipsClient();

  const user = UserFactory.sample({
    firstName: 'Bob',
    lastName: 'Wick',
    email: 'bob@wick.com',
    jobTitle: 'Engineer',
    features: { BO_WEB_APP_DEV: true },
    account: {
      id: 'acc-1',
      name: 'Elephant Academy',
    },
  });

  const account = AccountsFactory.sample({
    id: 'acc-1',
    name: 'Elephant Academy',
    createdAt: new Date('2023-09-18T14:19:55.612Z'),
  });

  const wrapper = (
    currentUser: User = user,
    accountToInsert: Account = account,
  ) => {
    boclipsClient.users.insertCurrentUser(currentUser);
    boclipsClient.accounts.insertAccount(accountToInsert);

    render(
      <MemoryRouter initialEntries={['/account']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={boclipsClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    boclipsClient.users.clear();
  });

  it('renders my account page', async () => {
    wrapper();
    expect(await screen.findByText('My Account')).toBeInTheDocument();
  });

  it('renders delete data info', async () => {
    wrapper();
    expect(
      await screen.findByText(
        /For information on the account data we collect and for any requests to access or delete your data please refer to our/,
      ),
    ).toBeInTheDocument();
    const privacyPolicyLink = await screen.findByRole('link', {
      name: 'Privacy Policy.',
    });
    expect(privacyPolicyLink).toHaveAttribute(
      'href',
      'https://www.boclips.com/privacy-policy',
    );
  });

  it('displays My Account as window title', async () => {
    wrapper();

    await waitFor(() => {
      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('My Account');
    });
  });

  it('renders 404 when BO_WEB_APP_DEV is disabled', async () => {
    const userWithoutDevAccess = UserFactory.sample({
      features: { BO_WEB_APP_DEV: false },
    });
    wrapper(userWithoutDevAccess);

    expect(await screen.findByText('Page not found!')).toBeInTheDocument();
  });

  describe('User Profile', () => {
    it('renders my profile section', async () => {
      wrapper();

      const userProfile = await screen.findByRole('main');

      expect(
        within(userProfile).getByText(/Personal Profile/),
      ).toBeInTheDocument();
      expect(within(userProfile).getByText(/Name:/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Bob Wick/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Email:/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/bob@wick.com/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Job Title:/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Engineer/)).toBeInTheDocument();
    });

    it('edit my profile section', async () => {
      wrapper();

      const userProfile = await screen.findByRole('main');
      expect(within(userProfile).getByText(/Bob Wick/)).toBeInTheDocument();

      fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));

      await waitFor(() =>
        screen.getByRole('heading', {
          level: 1,
          name: 'Edit Personal Profile',
        }),
      );

      const firstNameInput = screen.getByDisplayValue('Bob');
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, 'Andy');

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitForElementToBeRemoved(() =>
        screen.getByRole('heading', {
          level: 1,
          name: 'Edit Personal Profile',
        }),
      );

      await waitFor(() =>
        expect(
          screen.getByText(/User edited successfully/),
        ).toBeInTheDocument(),
      );
    });

    it('does not render values when data is missing', async () => {
      const userWithMissingInfo = UserFactory.sample({
        lastName: 'tooth',
        email: 'tooth-fairy@boclips.com',
        features: { BO_WEB_APP_DEV: true },
      });
      wrapper(userWithMissingInfo);

      const userProfile = await screen.findByRole('main');
      expect(within(userProfile).getByText(/Name:/)).toBeInTheDocument();
      expect(
        within(userProfile).queryByText(/Job Title:/),
      ).not.toBeInTheDocument();
    });
  });

  describe('Organization Profile', () => {
    it('renders my organization section', async () => {
      wrapper();
      expect(
        await screen.findByText(/Organization Profile/),
      ).toBeInTheDocument();
      expect(await screen.findByText(/Elephant Academy/)).toBeInTheDocument();
      expect(await screen.findByText(/Created on/)).toBeInTheDocument();
      expect(await screen.findByText(/18 September 2023/)).toBeInTheDocument();
    });

    it('does not render org profile when account data is missing', async () => {
      const userWithMissingAccount = UserFactory.sample({
        lastName: 'tooth',
        email: 'tooth-fairy@boclips.com',
        features: { BO_WEB_APP_DEV: true },
      });
      wrapper(userWithMissingAccount);

      expect(
        screen.queryByText(/Organization Profile/),
      ).not.toBeInTheDocument();
    });

    it('does not render org profile info when data is missing', async () => {
      const userWithMissingAccount = UserFactory.sample({
        lastName: 'tooth',
        email: 'tooth-fairy@boclips.com',
        features: { BO_WEB_APP_DEV: true },
        account: {
          id: 'acc-2',
          name: 'Ant Academy',
        },
      });

      const accountWithMissingInfo = AccountsFactory.sample({
        id: 'acc-2',
        name: 'Ant Academy',
      });

      wrapper(userWithMissingAccount, accountWithMissingInfo);

      expect(await screen.findByText(/Ant Academy/)).toBeInTheDocument();
      expect(screen.queryByText(/Signup date/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Length of access/)).not.toBeInTheDocument();
    });

    it('displays skeleton when loading', async () => {
      wrapper();

      expect(await screen.findByTestId('skeleton')).toBeInTheDocument();
    });
  });
});
