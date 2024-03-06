import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { MemoryRouter } from 'react-router-dom';
import PlaylistOwnerBadge from 'src/components/playlists/playlistHeader/PlaylistOwnerBadge';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Playlist Owner Badge', () => {
  it('displays you when playlist is owned by current user', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: true,
    });

    const wrapper = renderPlaylistOwnerBadge(playlist);

    expect(wrapper.getByLabelText('playlist owned by You')).toBeInTheDocument();
    expect(wrapper.getByText('By: You')).toBeVisible();
  });

  it('displays playlist owner name', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      ownerName: 'The Owner',
    });

    const wrapper = renderPlaylistOwnerBadge(playlist);

    expect(
      wrapper.getByLabelText('playlist owned by The Owner'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: The Owner')).toBeVisible();
  });

  it('displays nothing when owner name not provided', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      ownerName: '',
    });

    const wrapper = renderPlaylistOwnerBadge(playlist);

    expect(
      wrapper.queryByLabelText('playlist owned by', { exact: false }),
    ).not.toBeInTheDocument();
  });

  it('displays Boclips when playlist is createdBy Boclips for external user', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          name: 'Not Boclips',
          type: AccountType.STANDARD,
          createdAt: new Date(),
        },
      }),
    );

    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      createdBy: 'Boclips',
      ownerName: 'The Owner',
    });

    const wrapper = renderPlaylistOwnerBadge(playlist, client);

    expect(
      wrapper.getByLabelText('playlist owned by Boclips'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: Boclips')).toBeVisible();
  });

  it('displays ownerName (Boclips) when playlist is createdBy Boclips for internal user', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          name: 'Boclips',
          type: AccountType.STANDARD,
          createdAt: new Date(),
        },
      }),
    );

    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      createdBy: 'Boclips',
      ownerName: 'The Owner',
    });

    const wrapper = renderPlaylistOwnerBadge(playlist, client);

    expect(
      wrapper.getByLabelText('playlist owned by Boclips'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: Boclips')).toBeVisible();
  });

  it('displays You when playlist is createdBy Boclips but is mine', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: true,
      createdBy: 'Boclips',
      ownerName: 'The Owner',
    });

    const wrapper = renderPlaylistOwnerBadge(playlist);

    expect(wrapper.getByLabelText('playlist owned by You')).toBeInTheDocument();
    expect(wrapper.getByText('By: You')).toBeVisible();
  });

  function renderPlaylistOwnerBadge(
    playlist: Collection,
    client: FakeBoclipsClient = new FakeBoclipsClient(),
  ): RenderResult {
    return render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <PlaylistOwnerBadge playlist={playlist} />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );
  }
});
