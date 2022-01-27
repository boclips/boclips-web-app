import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

export const playlists = [
  CollectionFactory.sample({
    title: 'box',
  }),
  CollectionFactory.sample({
    title: 'print',
  }),
  CollectionFactory.sample({
    title: 'scorn',
  }),
  CollectionFactory.sample({
    title: 'sing',
  }),
  CollectionFactory.sample({
    title: 'group',
  }),
  CollectionFactory.sample({
    title: 'kneel',
  }),
];

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

    it('Displays tiles for retrieved playlists', async () => {
      const fakeClient = new FakeBoclipsClient();
      const queryClient = new QueryClient();

      playlists.forEach((playlist) => {
        fakeClient.collections.addToFake(playlist);
      });

      const wrapper = render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/library']}>
            <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      playlists.forEach(async (it) => {
        expect(await wrapper.findByText(it.title)).toBeInTheDocument();
      });
    });
  });
});
