import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import PlaylistBody from 'src/components/playlists/PlaylistBody';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('Playlist Body', () => {
  it('has add to playlist button when playlist has one video', async () => {
    const fakeClient = new FakeBoclipsClient();
    const videos = [VideoFactory.sample({ id: 'video-1', title: 'Video One' })];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <PlaylistBody videos={videos} />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    const addToPlaylistButton = await wrapper.findByRole('button', {
      name: 'Add to playlist',
    });

    expect(addToPlaylistButton).toBeVisible();
  });

  it('has information message when no video on a playlist', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <MemoryRouter>
          <PlaylistBody videos={[]} />
        </MemoryRouter>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.queryByText('In this playlist:'),
    ).not.toBeInTheDocument();

    const textElement = wrapper.getByTestId('emptyPlaylistText');

    expect(
      textElement.innerHTML.startsWith(
        'Save interesting videos to this playlist. Simply click the',
      ),
    ).toEqual(true);

    expect(
      textElement.innerHTML.endsWith('button on any video to get started.'),
    ).toEqual(true);

    expect(textElement).toBeVisible();
    expect(wrapper.getByRole('img')).toBeVisible();
  });

  it('playlist card has price info', async () => {
    const fakeClient = new FakeBoclipsClient();
    const videoWithPrice = VideoFactory.sample({
      title: 'video with price',
      price: {
        currency: 'USD',
        amount: 150,
      },
    });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <MemoryRouter>
            <PlaylistBody videos={[videoWithPrice]} />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(wrapper.getByText(videoWithPrice.title)).toBeInTheDocument();
    expect(wrapper.getByText('$150')).toBeInTheDocument();
  });
});
