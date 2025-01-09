import React from 'react';
import {
  CollectionAssetFactory,
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Link } from 'boclips-api-client/dist/types';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';

const createAssetWithThumbnail = (id: string, videoTitle: string) => {
  return CollectionAssetFactory.sample({
    id: { videoId: id },
    video: VideoFactory.sample({
      id,
      title: `${videoTitle} ${id}`,
      playback: PlaybackFactory.sample({
        links: {
          thumbnail: new Link({ href: 'http://thumbnail.jpg' }),
          createPlayerInteractedWithEvent: new Link({ href: 'todo' }),
        },
      }),
    }),
  });
};

describe('Playlist view - reorder', () => {
  const client = new FakeBoclipsClient();

  const assets = [
    createAssetWithThumbnail('111', 'Video One'),
    createAssetWithThumbnail('222', 'Video Two'),
    createAssetWithThumbnail('333', 'Video Three'),
    createAssetWithThumbnail('444', 'Video Four'),
    createAssetWithThumbnail('555', 'Video Five'),
  ];

  const playlist1 = CollectionFactory.sample({
    id: '123',
    title: 'Hello there',
    description: 'Very nice description',
    assets,
    owner: 'myuserid',
    mine: true,
  });

  const playlist2 = CollectionFactory.sample({
    id: '321',
    title: 'Hello there',
    description: 'Very nice description',
    assets,
    owner: 'myuserid',
    mine: false,
  });

  beforeEach(() => {
    assets.forEach((it) => client.videos.insertVideo(it.video));
    client.collections.setCurrentUser('myuserid');
    client.users.insertCurrentUser(
      UserFactory.sample({
        id: 'myuserid',
      }),
    );
    client.collections.addToFake(playlist1);
    client.collections.addToFake(playlist2);
  });

  afterEach(() => {
    client.collections.clear();
    client.carts.clear();
    client.videos.clear();
    client.users.clear();
  });

  it('allows to reorder your playlist', async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    expect(screen.getByText('Reorder videos')).toBeInTheDocument();
  });

  it('hides reorder option when playlist is not yours', async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/321']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    expect(screen.queryByText('Reorder videos')).not.toBeInTheDocument();
  });
});
