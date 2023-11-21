import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

describe('My Account view', () => {
  const user = UserFactory.sample({
    firstName: 'Bob',
    lastName: 'Wick',
    email: 'bob@wick.com',
    jobTitle: 'Engineer',
    features: { BO_WEB_APP_DEV: true },
  });

  const wrapper = (currentUser: User = user) => {
    const boclipsClient = new FakeBoclipsClient();
    boclipsClient.users.insertCurrentUser(currentUser);

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

  it('renders my account page', async () => {
    wrapper();
    expect(await screen.findByText('My Account')).toBeInTheDocument();
  });

  it('renders my profile section', async () => {
    wrapper();

    expect(await screen.findByText(/Name:/)).toBeInTheDocument();
    expect(await screen.findByText(/Bob Wick/)).toBeInTheDocument();
    expect(await screen.findByText(/Email:/)).toBeInTheDocument();
    expect(await screen.findByText(/bob@wick.com/)).toBeInTheDocument();
    expect(await screen.findByText(/Job Title:/)).toBeInTheDocument();
    expect(await screen.findByText(/Engineer/)).toBeInTheDocument();
  });

  it('displays My Account as window title', async () => {
    wrapper();

    await waitFor(() => {
      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('My Account');
    });
  });

  it('does not render values when data is missing', async () => {
    const userWithMissingInfo = UserFactory.sample({
      lastName: 'tooth',
      email: 'tooth-fairy@boclips.com',
      features: { BO_WEB_APP_DEV: true },
    });
    wrapper(userWithMissingInfo);

    expect(await screen.findByText(/Name:/)).toBeInTheDocument();
    expect(screen.queryByText(/Job Title:/)).not.toBeInTheDocument();
  });

  it('renders 404 when BO_WEB_APP_DEV is disabled', async () => {
    const userWithoutDevAccess = UserFactory.sample({
      features: { BO_WEB_APP_DEV: false },
    });
    wrapper(userWithoutDevAccess);

    expect(await screen.findByText('Page not found!')).toBeInTheDocument();
  });
});
