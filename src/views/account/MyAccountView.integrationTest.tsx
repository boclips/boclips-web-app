import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('My Account view', () => {
  const user = UserFactory.sample({
    firstName: 'Bob',
    lastName: 'Wick',
    email: 'bob@wick.com',
    jobTitle: 'Engineer',
    features: { BO_WEB_APP_DEV: true },
  });

  beforeEach(() => {
    const boclipsClient = new FakeBoclipsClient();
    boclipsClient.users.insertCurrentUser(user);

    render(
      <MemoryRouter initialEntries={['/account']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={boclipsClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );
  });

  it('renders my account page', async () => {
    expect(await screen.findByText('My Account')).toBeInTheDocument();
  });

  it('renders my profile section', async () => {
    expect(await screen.findByText(/Name:/)).toBeInTheDocument();
    expect(await screen.findByText(/Bob Wick/)).toBeInTheDocument();
    expect(await screen.findByText(/Email:/)).toBeInTheDocument();
    expect(await screen.findByText(/bob@wick.com/)).toBeInTheDocument();
    expect(await screen.findByText(/Job Title:/)).toBeInTheDocument();
    expect(await screen.findByText(/Engineer/)).toBeInTheDocument();
  });

  it('displays My Account as window title', async () => {
    await waitFor(() => {
      const helmet = Helmet.peek();
      expect(helmet.title).toEqual('My Account');
    });
  });

  it('renders 404 when BO_WEB_APP_DEV is disabled', async () => {
    const boclipsClient = new FakeBoclipsClient();
    boclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: false });

    render(
      <MemoryRouter initialEntries={['/account']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={boclipsClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Page not found!')).toBeInTheDocument();
  });
});
