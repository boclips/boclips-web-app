import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('LibraryView', () => {
  describe('when playlists feature is enabled', () => {
    const client = new FakeBoclipsClient();
    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
      );
    });

    it('loads the title for library page', async () => {
      render(
        <MemoryRouter initialEntries={['/library']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      expect(await screen.findByText('Your Library')).toBeInTheDocument();
    });
  });
  describe('when playlists feature is disabled', () => {
    const client = new FakeBoclipsClient();
    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          features: { BO_WEB_APP_ENABLE_PLAYLISTS: false },
        }),
      );
    });

    it('shows a blank page', async () => {
      render(
        <MemoryRouter initialEntries={['/library']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      expect(await screen.findByText('Your Library')).not.toBeInTheDocument();
    });
  });
});
