import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClient } from 'boclips-api-client';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { QueryClient } from '@tanstack/react-query';
import { Link } from 'boclips-api-client/dist/types';

const insertUser = (client: FakeBoclipsClient) =>
  client.users.insertCurrentUser(UserFactory.sample());

const renderPlaylistsView = (client: BoclipsClient) =>
  render(
    <MemoryRouter initialEntries={['/playlists']}>
      <App
        apiClient={client}
        boclipsSecurity={stubBoclipsSecurity}
        reactQueryClient={new QueryClient()}
      />
    </MemoryRouter>,
  );

describe('PlaylistsView', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('displays pagination when more than 20 playlists', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    loadPlaylists(client, 25);

    const wrapper = renderPlaylistsView(client);

    await waitFor(() => wrapper.findByText('Playlist 1')).then((it) =>
      expect(it).toBeInTheDocument(),
    );

    expect(
      wrapper.getByRole('button', { name: 'go to next page' }),
    ).toBeVisible();
  });

  it(`doesn't display pagination when less than 20 playlists`, async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    loadPlaylists(client, 15);

    const wrapper = renderPlaylistsView(client);
    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(
      await wrapper.queryByRole('button', { name: 'Next page' }),
    ).toBeNull();
  });

  it('renders playlists created by the user', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    loadPlaylists(client, 10);

    const wrapper = renderPlaylistsView(client);

    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.findByText('Playlist 2')).toBeVisible();
  });

  it('loads playlists when paginating', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    loadPlaylists(client, 41);

    const wrapper = renderPlaylistsView(client);
    await waitFor(() => wrapper.findByText('Playlist 0')).then((it) =>
      expect(it).toBeInTheDocument(),
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'go to next page' }));

    expect(await wrapper.findByText('Playlist 20')).toBeVisible();
    expect(wrapper.queryByText('Playlist 0')).toBeNull();

    fireEvent.click(wrapper.getByRole('button', { name: 'go to next page' }));

    await waitFor(() => wrapper.getByText('Playlist 40')).then((it) => {
      expect(it).toBeInTheDocument();
    });

    expect(wrapper.queryByText('Playlist 20')).toBeNull();
  });

  function loadPlaylists(client: FakeBoclipsClient, quantity: number) {
    Array.from(Array(quantity).keys()).forEach((i) => {
      const playlist = CollectionFactory.sample({
        id: `${i}`,
        title: `Playlist ${i}`,
        links: CollectionFactory.sampleLinks({
          bookmark: undefined,
          unbookmark: new Link({
            href: `https://api.boclips.com/v1/collections/${i}?bookmarked=false`,
          }),
        }),
      });
      client.collections.addToFake(playlist);
    });
  }
});
