import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import UnauthorizedPlaylistView from 'src/views/unauthorizedPlaylistView/UnauthorizedPlaylistView';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

describe('Playlist View', () => {
  it('should display the share code modal for classroom playlist page', async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <MemoryRouter
            initialEntries={['/playlists/shared/playlist-id?referer=id']}
          >
            <UnauthorizedPlaylistView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByRole('dialog')).toBeVisible();
    expect(wrapper.getByText('Enter code to watch videos')).toBeVisible();
    expect(wrapper.getByPlaceholderText('Teacher code')).toBeVisible();
    expect(wrapper.getByText('Watch Video')).toBeVisible();
  });

  it('should display playlist when correct share code is provided', async () => {
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

    apiClient.collections.addValidShareCode('pl123', '1234');

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

    expect(await wrapper.findByRole('dialog')).toBeVisible();

    const input = wrapper.getByPlaceholderText('Teacher code');
    const button = wrapper.getByRole('button', { name: 'Watch Video' });

    expect(button).toHaveAttribute('disabled');

    await userEvent.type(input, '1234');

    expect(button).not.toHaveAttribute('disabled');

    await userEvent.click(wrapper.getByRole('button', { name: 'Watch Video' }));

    await waitForElementToBeRemoved(() => wrapper.getByRole('dialog'));
    expect(wrapper.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      wrapper.getAllByText('You got mud on your face, you big disgrace'),
    ).toHaveLength(2);
    expect(
      wrapper.getByText('We will, we will rock you, we will, we will rock you'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: fckinfreddy')).toBeInTheDocument();
    expect(
      wrapper.getByText('Somebody better put you back into your place'),
    ).toBeInTheDocument();
  });
});
