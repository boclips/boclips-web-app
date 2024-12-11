import React from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@src/App';
import { createReactQueryClient } from '@src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import userEvent from '@testing-library/user-event';

describe('Profile view', () => {
  const boclipsClient = new FakeBoclipsClient();

  const user = UserFactory.sample({
    firstName: 'Bob',
    lastName: 'Wick',
    email: 'bob@wick.com',
    jobTitle: 'Engineer',
    account: {
      id: 'acc-1',
      name: 'Elephant Academy',
      products: [Product.LIBRARY],
      type: AccountType.STANDARD,
      createdAt: new Date('2024-03-05T08:38:50.971544Z'),
    },
  });

  const wrapper = (currentUser: User = user) => {
    boclipsClient.users.insertCurrentUser(currentUser);

    render(
      <MemoryRouter initialEntries={['/profile']}>
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

  it('renders profile page', async () => {
    wrapper();
    expect(await screen.findByText('Profile')).toBeInTheDocument();
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

  it('displays Profile as window title', async () => {
    wrapper();

    await waitFor(() => {
      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('Profile');
    });
  });

  describe('User Profile', () => {
    it('renders my profile section', async () => {
      wrapper();

      const userProfile = await screen.findByRole('main');

      expect(within(userProfile).getByText(/Personal/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Name:/)).toBeInTheDocument();
      expect(
        await within(userProfile).findByText(/Bob Wick/),
      ).toBeInTheDocument();
      expect(within(userProfile).getByText(/Email:/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/bob@wick.com/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Job Title:/)).toBeInTheDocument();
      expect(within(userProfile).getByText(/Engineer/)).toBeInTheDocument();
    });

    it('edit my profile section', async () => {
      wrapper();

      const userProfile = await screen.findByRole('main');
      expect(
        await within(userProfile).findByText(/Bob Wick/),
      ).toBeInTheDocument();

      await userEvent.click(
        await screen.findByRole('button', { name: 'Edit' }),
      );

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
          screen.getByText(/Your profile has been changed successfully/),
        ).toBeInTheDocument(),
      );
    });

    it('does not render values when data is missing', async () => {
      const userWithMissingInfo = UserFactory.sample({
        lastName: 'tooth',
        email: 'tooth-fairy@boclips.com',
      });
      wrapper(userWithMissingInfo);

      const userProfile = await screen.findByRole('main');
      expect(within(userProfile).getByText(/Name:/)).toBeInTheDocument();
      expect(
        within(userProfile).queryByText(/Job Title:/),
      ).not.toBeInTheDocument();
    });
  });

  describe('User Profile for Classroom', () => {
    it('hides job title', async () => {
      const classroomUser = UserFactory.sample({
        account: {
          id: 'acc-2',
          name: 'Owl Academy',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          createdAt: new Date('2024-03-05T08:38:50.971544Z'),
        },
      });
      wrapper(classroomUser);

      const userProfile = await screen.findByRole('main');

      expect(within(userProfile).getByText(/Personal/)).toBeInTheDocument();
      expect(
        within(userProfile).queryByText(/Job Title:/),
      ).not.toBeInTheDocument();
    });
  });

  describe('Organization Profile', () => {
    it('renders my organization section', async () => {
      wrapper();
      expect(await screen.findByText(/Organization/)).toBeInTheDocument();
      expect(await screen.findByText(/Elephant Academy/)).toBeInTheDocument();
      expect(await screen.findByText(/Created on/)).toBeInTheDocument();
      expect(await screen.findByText(/March 2024/)).toBeInTheDocument();
    });
  });

  describe('School Profile for Classroom', () => {
    it('renders school and date for classroom', async () => {
      const classroomUser = UserFactory.sample({
        firstName: 'Bob',
        lastName: 'Wick',
        email: 'bob@owl.com',
        jobTitle: 'Engineer',
        account: {
          id: 'acc-2',
          name: 'Owl Academy',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          createdAt: new Date('2024-03-05T08:38:50.971544Z'),
        },
      });
      wrapper(classroomUser);
      expect(await screen.findByText(/School/)).toBeInTheDocument();
      expect(await screen.findByText(/Owl Academy/)).toBeInTheDocument();
      expect(await screen.findByText(/Created on/)).toBeInTheDocument();
      expect(await screen.findByText(/March 2024/)).toBeInTheDocument();
    });
  });
});
