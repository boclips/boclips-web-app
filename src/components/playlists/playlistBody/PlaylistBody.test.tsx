import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import PlaylistBody from 'src/components/playlists/playlistBody/PlaylistBody';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';

describe('Playlist Body', () => {
  const getWrapper = (
    fakeClient = new FakeBoclipsClient(),
    playlist = CollectionFactory.sample({
      id: '123',
      videos: [],
    }),
  ) => {
    return render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <PlaylistBody playlist={playlist} />
            </MemoryRouter>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );
  };

  it('has add to playlist button when playlist has one video', async () => {
    const videos = [VideoFactory.sample({ id: 'video-1', title: 'Video One' })];

    const wrapper = getWrapper(
      undefined,
      CollectionFactory.sample({
        id: '123',
        videos,
      }),
    );

    const addToPlaylistButton = await wrapper.findByRole('button', {
      name: 'Add to playlist',
    });

    expect(addToPlaylistButton).toBeVisible();
  });

  it('has information message when no video on a playlist', async () => {
    const wrapper = getWrapper();

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
    const videoWithPrice = VideoFactory.sample({
      title: 'video with price',
      price: {
        currency: 'USD',
        amount: 150,
      },
    });

    const playlist = CollectionFactory.sample({
      id: '123',
      videos: [videoWithPrice],
    });

    const wrapper = getWrapper(undefined, playlist);

    expect(wrapper.getByText(videoWithPrice.title)).toBeInTheDocument();
    expect(wrapper.getByText('$150')).toBeInTheDocument();
  });
});

describe('focus', () => {
  it('focuses on the main after removing the last video of a playlist', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.setCurrentUser('user-123');
    const video = VideoFactory.sample({});
    const playlist = CollectionFactory.sample({
      id: '321111',
      owner: 'user-123',
      mine: true,
      videos: [video],
      title: 'Courage the Cowardly Dog',
    });
    fakeClient.collections.addToFake(playlist);

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <PlaylistBody playlist={playlist} />
            </MemoryRouter>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      wrapper.getByLabelText('Add or remove from playlist'),
    ).then((it) => {
      fireEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Courage the Cowardly Dog'));

    await waitForElementToBeRemoved(() => wrapper.getByText('Add to playlist'));

    await waitFor(() =>
      expect(wrapper.getByRole('main')).toBe(document.activeElement),
    );
  });

  it('focuses on main after removing a video from a playlist that has more', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.setCurrentUser('user-123');
    const video1 = VideoFactory.sample({});
    const video2 = VideoFactory.sample({});

    const playlist = CollectionFactory.sample({
      id: '123',
      owner: 'user-123',
      mine: true,
      videos: [video1, video2],
      title: 'Courage the Cowardly Dog',
    });
    fakeClient.collections.addToFake(playlist);

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <PlaylistBody playlist={playlist} />
            </MemoryRouter>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      wrapper.getAllByLabelText('Add or remove from playlist'),
    ).then((it) => {
      fireEvent.click(it[1]);
    });

    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'Courage the Cowardly Dog',
      }),
    );

    await waitFor(() => expect(wrapper.getByRole('main')).toHaveFocus());
  });
});
