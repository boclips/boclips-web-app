import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
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
import { createBrowserHistory } from 'history';

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

describe('Playlist view', () => {
  const client = new FakeBoclipsClient();

  const videos = [
    createVideoWithThumbnail('111', 'Video One'),
    createVideoWithThumbnail('222', 'Video Two'),
    createVideoWithThumbnail('333', 'Video Three'),
    createVideoWithThumbnail('444', 'Video Four'),
    createVideoWithThumbnail('555', 'Video Five'),
  ];

  const playlist = CollectionFactory.sample({
    id: '123',
    title: 'Hello there',
    description: 'Very nice description',
    videos,
  });

  beforeEach(() => {
    client.collections.clear();
    client.videos.clear();

    videos.forEach((it) => client.videos.insertVideo(it));
    client.users.insertCurrentUser(
      UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
    );
    client.collections.addToFake(playlist);
  });

  it("shows Playlist's title and description if user can access", async () => {
    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Hello there')).toBeVisible();
    expect(await screen.findByText('Very nice description')).toBeVisible();
  });

  it('displays video title for all videos in the playlist', async () => {
    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Video One 111')).toBeVisible();
    expect(screen.getByText('Video Two 222')).toBeVisible();
    expect(screen.getByText('Video Three 333')).toBeVisible();
    expect(screen.getByText('Video Four 444')).toBeVisible();
    expect(screen.getByText('Video Five 555')).toBeVisible();
  });

  it('displays thumbnails for all videos in the playlist', async () => {
    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(
      await screen.findByLabelText('Thumbnail of Video One 111'),
    ).toBeVisible();

    expect(
      await screen.findByLabelText('Thumbnail of Video Two 222'),
    ).toBeVisible();
    expect(
      await screen.findByLabelText('Thumbnail of Video Three 333'),
    ).toBeVisible();
    expect(
      await screen.findByLabelText('Thumbnail of Video Four 444'),
    ).toBeVisible();
    expect(
      await screen.findByLabelText('Thumbnail of Video Five 555'),
    ).toBeVisible();
    expect(screen.getByText('In this playlist:')).toBeVisible();
  });

  it('navigates to the video page when clicked on video', async () => {
    const history = createBrowserHistory();
    history.push({ pathname: '/library/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    const tile = await screen.findByText('Video One 111');
    expect(tile).toBeVisible();
    fireEvent.click(tile);

    expect(history.location.pathname).toEqual('/videos/111');
  });
});
