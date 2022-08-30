import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClient } from 'boclips-api-client';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { QueryClient } from 'react-query';

const insertUser = (client: FakeBoclipsClient) =>
  client.users.insertCurrentUser(UserFactory.sample());

const renderLibraryView = (client: BoclipsClient) =>
  render(
    <MemoryRouter initialEntries={['/library']}>
      <App
        apiClient={client}
        boclipsSecurity={stubBoclipsSecurity}
        reactQueryClient={new QueryClient()}
      />
    </MemoryRouter>,
  );

describe('LibraryView', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('displays pagination when more than 10 playlists', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    Array.from(Array(15).keys()).forEach((i) => {
      const playlist = CollectionFactory.sample({
        id: `${i}`,
        title: `Playlist ${i}`,
      });
      client.collections.addToFake(playlist);
    });

    const wrapper = renderLibraryView(client);
    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.getByTestId('library-pagination')).toBeInTheDocument();
  });

  xit('renders playlists created by the user', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);

    const playlists = [
      CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
      CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '3', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '4', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '5', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '6', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '7', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '8', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '9', title: 'Playlist 2' }),
      CollectionFactory.sample({ id: '10', title: 'Playlist 2' }),
    ];

    playlists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderLibraryView(client);

    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.findByText('Playlist 2')).toBeVisible();
  });
});
