import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';
import UnauthorizedPlaylistView from 'src/views/unauthorizedPlaylistView/UnauthorizedPlaylistView';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

describe('Playlist View', () => {
  it('should display playlist when valid referer is provided', async () => {
    const apiClient = new FakeBoclipsClient();
    const playlist = CollectionFactory.sample({
      id: 'playlist-id',
      title: 'You got mud on your face, you big disgrace',
      description: 'We will, we will rock you, we will, we will rock you',
      videos: [
        VideoFactory.sample({
          id: 'video1',
          title: 'Somebody better put you back into your place',
        }),
      ],
      mine: false,
      ownerName: 'fckinfreddy',
    });
    apiClient.collections.addToFake(playlist);
    apiClient.collections.addValidReferer('pl123');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter
            initialEntries={['/playlists/shared/playlist-id?referer=pl123']}
          >
            <UnauthorizedPlaylistView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findAllByText('You got mud on your face, you big disgrace'),
    ).toHaveLength(2);
    expect(
      wrapper.getByText('We will, we will rock you, we will, we will rock you'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: fckinfreddy')).toBeInTheDocument();
    expect(
      wrapper.getByText('Somebody better put you back into your place'),
    ).toBeInTheDocument();
  });

  it('should display page not found when referer invalid', async () => {
    const apiClient = new FakeBoclipsClient();
    const playlist = CollectionFactory.sample({
      id: 'playlist-id',
      title: 'You got mud on your face, you big disgrace',
      description: 'We will, we will rock you, we will, we will rock you',
      videos: [
        VideoFactory.sample({
          id: 'video1',
          title: 'Somebody better put you back into your place',
        }),
      ],
      mine: false,
      ownerName: 'fckinfreddy',
    });
    apiClient.collections.addToFake(playlist);

    apiClient.collections.addValidReferer('another-referer');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter
            initialEntries={['/playlists/shared/playlist-id?referer=pl123']}
          >
            <UnauthorizedPlaylistView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('should display page not found when referer not present', async () => {
    const apiClient = new FakeBoclipsClient();
    const playlist = CollectionFactory.sample({
      id: 'playlist-id',
      title: 'You got mud on your face, you big disgrace',
      description: 'We will, we will rock you, we will, we will rock you',
      videos: [
        VideoFactory.sample({
          id: 'video1',
          title: 'Somebody better put you back into your place',
        }),
      ],
      mine: false,
      ownerName: 'fckinfreddy',
    });
    apiClient.collections.addToFake(playlist);

    apiClient.collections.addValidReferer('another-referer');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter initialEntries={['/playlists/shared/playlist-id']}>
            <UnauthorizedPlaylistView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });
});
