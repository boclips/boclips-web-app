import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import userEvent from '@testing-library/user-event';

describe('Leaving comments on a video in collection', () => {
  it('can view video comments on a playlist', async () => {
    const client = new FakeBoclipsClient();
    const video = VideoFactory.sample({ id: '123', title: 'title' });
    const playlist = CollectionFactory.sample({
      id: 'pl123',
      title: 'Original playlist',
      description: 'Description of original playlist',
      videos: [video],
      mine: true,
      owner: 'itsmemario',
      comments: {
        videos: {
          [video.id]: [
            {
              id: 'video1',
              userId: 'user-id',
              name: 'remy o',
              email: 'remy@boclips.com',
              text: 'this is a comment',
              createdAt: '2023-01-04T14:46:43.529Z',
            },
          ],
        },
      },
    });

    client.collections.setCurrentUser('itsmemario');
    client.collections.addToFake(playlist);
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });

    render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText('Playlists'));

    expect(screen.getByTestId('add-comment-button')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('add-comment-button'));

    const sliderPanel = screen.getByTestId(`slider-panel-${video.id}`);

    expect(within(sliderPanel).getByText('Comments')).toBeInTheDocument();
    expect(within(sliderPanel).getByText(video.title)).toBeInTheDocument();
    expect(
      within(sliderPanel).getByPlaceholderText('Add a comment'),
    ).toBeInTheDocument();
    expect(within(sliderPanel).getByText('remy o')).toBeInTheDocument();
    expect(
      within(sliderPanel).getByText('2023-01-04 14:46'),
    ).toBeInTheDocument();

    expect(
      within(sliderPanel).getByText('this is a comment'),
    ).toBeInTheDocument();
  });

  it('can add a comment to a video in collection', async () => {
    const client = new FakeBoclipsClient();
    const video = VideoFactory.sample({ id: '123', title: 'title' });
    const playlist = CollectionFactory.sample({
      id: 'pl123',
      title: 'Original playlist',
      description: 'Description of original playlist',
      videos: [video],
      mine: true,
      owner: 'itsmemario',
      comments: {
        videos: {},
      },
    });
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser('itsmemario');
    client.collections.addToFake(playlist);

    render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText('Playlists'));

    await userEvent.click(screen.getByTestId('add-comment-button'));

    const slider = screen.getByTestId(`slider-panel-${video.id}`);

    await userEvent.type(
      within(slider).getByPlaceholderText('Add a comment'),
      'cieslak, k 1 2 3',
    );

    await userEvent.click(within(slider).getByText('Reply'));

    await waitFor(() => {
      expect(within(slider).getByText('cieslak, k 1 2 3')).toBeInTheDocument();
    });
  });

  it('displays comment button if user has feature flag', async () => {
    const client = new FakeBoclipsClient();
    const video = VideoFactory.sample({ id: '123', title: 'title' });
    const playlist = CollectionFactory.sample({
      id: 'pl123',
      title: 'Original playlist',
      description: 'Description of original playlist',
      videos: [video],
      mine: true,
      owner: 'itsmemario',
      comments: {
        videos: {},
      },
    });
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser('itsmemario');
    client.collections.addToFake(playlist);

    render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText('Playlists'));

    expect(screen.getByTestId('add-comment-button')).toBeInTheDocument();
  });
});
