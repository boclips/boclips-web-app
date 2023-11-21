import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';

describe('My Account view', () => {
  beforeEach(() => {
    const boclipsClient = new FakeBoclipsClient();
    boclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });

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

  it('renders my dashboard page', async () => {
    expect(await screen.findByText('My Dashboard')).toBeInTheDocument();
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
