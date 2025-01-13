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
  CollectionAssetFactory,
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import PlaylistBody from 'src/components/playlists/playlistBody/PlaylistBody';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { renderWithClients } from 'src/testSupport/render';

describe('Playlist Body', () => {
  const getWrapper = (
    fakeClient = new FakeBoclipsClient(),
    playlist = CollectionFactory.sample({
      id: '123',
      assets: [],
    }),
    mode: 'GRID' | 'LIST' = 'GRID',
  ) => {
    fakeClient.videos.insertVideo(VideoFactory.sample({}));
    return render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <PlaylistBody playlist={playlist} mode={mode} />
            </MemoryRouter>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );
  };

  it('has add to playlist button when playlist has one video', async () => {
    const assets = [
      CollectionAssetFactory.sample({
        id: { videoId: 'video-1' },
        video: VideoFactory.sample({ id: 'video-1', title: 'Video One' }),
      }),
    ];

    const wrapper = getWrapper(
      undefined,
      CollectionFactory.sample({
        id: '123',
        assets,
      }),
    );

    const addToPlaylistButton = await wrapper.findByRole('button', {
      name: 'Add to playlist',
    });

    expect(addToPlaylistButton).toBeVisible();
  });

  it('has no buttons when requested', async () => {
    const assets = [
      CollectionAssetFactory.sample({
        id: { videoId: 'video-1' },
        video: VideoFactory.sample({ id: 'video-1', title: 'Video One' }),
      }),
    ];
    const playlist = CollectionFactory.sample({ id: '123', assets });

    const wrapper = renderWithClients(
      <PlaylistBody playlist={playlist} showButtons={false} />,
    );

    expect(
      wrapper.queryByRole('button', {
        name: 'Add to playlist',
      }),
    ).toBeNull();
  });

  it('has information message when no video on a playlist', async () => {
    const wrapper = getWrapper();

    expect(await wrapper.findByText('No videos here yet.')).toBeVisible();
    expect(
      wrapper.getByText('You can see videos here once you add some.'),
    ).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Add videos' })).toBeVisible();
  });

  it('playlist card has price info', async () => {
    const assetWithPrice = CollectionAssetFactory.sample({
      video: VideoFactory.sample({
        title: 'video with price',
        price: {
          currency: 'USD',
          amount: 150,
        },
      }),
    });

    const playlist = CollectionFactory.sample({
      id: '123',
      assets: [assetWithPrice],
    });

    const wrapper = getWrapper(undefined, playlist);

    expect(wrapper.getByText(assetWithPrice.video.title)).toBeInTheDocument();
    expect(wrapper.getByText('$150')).toBeInTheDocument();
  });

  it('playlist displays collection notes', async () => {
    const assetWithPrice = CollectionAssetFactory.sample({
      video: VideoFactory.sample({
        title: 'video with price',
      }),
      note: 'Test note',
    });

    const playlist = CollectionFactory.sample({
      id: '123',
      assets: [assetWithPrice],
    });

    const wrapper = getWrapper(undefined, playlist, 'LIST');

    expect(wrapper.getByText('Notes')).toBeVisible();
    expect(wrapper.getByText('Test note')).toBeVisible();
  });

  it('does not display notes header if there are no notes', async () => {
    const assetWithPrice = CollectionAssetFactory.sample({
      video: VideoFactory.sample({
        title: 'video with price',
      }),
      note: undefined,
    });

    const playlist = CollectionFactory.sample({
      id: '123',
      assets: [assetWithPrice],
    });

    const wrapper = getWrapper(undefined, playlist, 'LIST');

    expect(wrapper.queryByText('Notes')).toBeNull();
  });

  it('does not display notes header for GRID mode', async () => {
    const assetWithPrice = CollectionAssetFactory.sample({
      video: VideoFactory.sample({
        title: 'video with price',
      }),
      note: 'Test note',
    });

    const playlist = CollectionFactory.sample({
      id: '123',
      assets: [assetWithPrice],
    });

    const wrapper = getWrapper(undefined, playlist, 'GRID');

    expect(wrapper.queryByText('Notes')).toBeNull();
  });
});

describe('focus', () => {
  it('focuses on the main after removing the last video of a playlist', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.setCurrentUser('user-123');
    const asset = CollectionAssetFactory.sample({});
    const playlist = CollectionFactory.sample({
      id: '321111',
      owner: 'user-123',
      mine: true,
      assets: [asset],
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
    const asset1 = CollectionAssetFactory.sample({});
    const asset2 = CollectionAssetFactory.sample({});

    const playlist = CollectionFactory.sample({
      id: '123',
      owner: 'user-123',
      mine: true,
      assets: [asset1, asset2],
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
