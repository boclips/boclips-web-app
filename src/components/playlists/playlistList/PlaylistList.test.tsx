import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaylistList from 'src/components/playlists/playlistList/PlaylistList';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('PlaylistList', () => {
  const mockPlaylists: Pageable<ListViewCollection> = {
    page: [
      CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
      CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
    ],
    pageSpec: {
      totalElements: 10,
      totalPages: 2,
      number: 0,
      size: 2,
    },
  };

  it('renders playlist cards when there are filtered playlists', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <MemoryRouter initialEntries={['/playlists']}>
            <PlaylistList playlists={mockPlaylists} playlistType="mine" />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Playlist 1')).toBeInTheDocument();
    expect(screen.getByText('Playlist 2')).toBeInTheDocument();
  });

  it('renders empty state when there are no filtered playlists', () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
        },
      }),
    );

    const emptyPlaylists = {
      page: [],
      pageSpec: {
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 0,
      },
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <MemoryRouter initialEntries={['/playlists']}>
            <PlaylistList playlists={emptyPlaylists} playlistType="mine" />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText('No Playlists here yet.')).toBeInTheDocument();
  });

  it('applies filter function to playlists', () => {
    const filterFunc = (playlist: ListViewCollection) => playlist.id === '1';

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <MemoryRouter initialEntries={['/playlists']}>
            <PlaylistList
              playlists={mockPlaylists}
              playlistType="mine"
              filter={filterFunc}
            />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Playlist 1')).toBeInTheDocument();
    expect(screen.queryByText('Playlist 2')).not.toBeInTheDocument();
  });
});
