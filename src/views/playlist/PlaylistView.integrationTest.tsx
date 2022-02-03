import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Link } from 'boclips-api-client/dist/types';

describe('Playlist view', () => {
  it("shows Playlist's title and description if user can access", async () => {
    const client = new FakeBoclipsClient();

    client.users.insertCurrentUser(
      UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
    );

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Hello there',
      description: 'Very nice description',
    });

    client.collections.addToFake(playlist);

    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Hello there')).toBeVisible();
    expect(screen.getByText('Very nice description')).toBeVisible();
  });

  it('displays video title for all videos in the playlist', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
    );

    const videos = [
      createVideoWithThumbnail('111', 'Video One'),
      createVideoWithThumbnail('112', 'Video Two'),
      createVideoWithThumbnail('113', 'Video Three'),
      createVideoWithThumbnail('114', 'Video Four'),
    ];

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      videos,
    });

    client.collections.addToFake(playlist);
    videos.forEach((it) => client.videos.insertVideo(it));

    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Video One 111')).toBeVisible();
    expect(screen.getByText('Video Two 112')).toBeVisible();
    expect(screen.getByText('Video Three 113')).toBeVisible();
    expect(screen.getByText('Video Four 114')).toBeVisible();
  });

  it('displays thumbnails for all videos in the playlist', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
    );

    const videos = [
      createVideoWithThumbnail('111', 'Video One'),
      createVideoWithThumbnail('222', 'Video Two'),
      createVideoWithThumbnail('333', 'Video Three'),
      createVideoWithThumbnail('444', 'Video Four'),
      createVideoWithThumbnail('555', 'Video Five'),
    ];

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      videos,
    });

    client.collections.addToFake(playlist);
    videos.forEach((it) => client.videos.insertVideo(it));

    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(
      await screen.findByLabelText('Thumbnail of Video One 111'),
    ).toBeVisible();
    expect(screen.getByLabelText('Thumbnail of Video Two 222')).toBeVisible();
    expect(screen.getByLabelText('Thumbnail of Video Three 333')).toBeVisible();
    expect(screen.getByLabelText('Thumbnail of Video Four 444')).toBeVisible();
    expect(screen.getByLabelText('Thumbnail of Video Five 555')).toBeVisible();
  });

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
});
