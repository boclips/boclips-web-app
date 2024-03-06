import React from 'react';
import {
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

const createVideoWithThumbnail = (id: string, videoTitle: string) => {
  return VideoFactory.sample({
    id,
    title: `${videoTitle} ${id}`,
    playback: PlaybackFactory.sample({
      links: {
        thumbnail: new Link({ href: 'http://thumbnail.jpg' }),
        createPlayerInteractedWithEvent: new Link({ href: 'todo' }),
      },
    }),
  });
};

describe('Playlist view - reorder', () => {
  const client = new FakeBoclipsClient();

  const videos = [
    createVideoWithThumbnail('111', 'Video One'),
    createVideoWithThumbnail('222', 'Video Two'),
    createVideoWithThumbnail('333', 'Video Three'),
    createVideoWithThumbnail('444', 'Video Four'),
    createVideoWithThumbnail('555', 'Video Five'),
  ];

  const playlist1 = CollectionFactory.sample({
    id: '123',
    title: 'Hello there',
    description: 'Very nice description',
    videos,
    owner: 'myuserid',
    mine: true,
  });

  const playlist2 = CollectionFactory.sample({
    id: '321',
    title: 'Hello there',
    description: 'Very nice description',
    videos,
    owner: 'myuserid',
    mine: false,
  });

  beforeEach(() => {
    videos.forEach((it) => client.videos.insertVideo(it));
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
