import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { render } from '@src/testSupport/render';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import {
  fireEvent,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { AddToPlaylistButton } from '@components/addToPlaylistButton/AddToPlaylistButton';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';

describe('Add to playlist button', () => {
  const asset = CollectionAssetFactory.sample({
    video: VideoFactory.sample({ title: 'video killed the radio star' }),
  });

  it('displays info if there is no playlists', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={asset.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');

    fireEvent.click(playlistButton);

    expect(
      await wrapper.findByText('You have no playlists yet'),
    ).toBeInTheDocument();
  });

  it('shows loading information before playlists are loaded', async () => {
    const fakeClient = new FakeBoclipsClient();

    const playlists = [
      CollectionFactory.sample({
        id: '1',
        title: 'Playlist 1',
        owner: 'user-123',
        mine: true,
      }),
    ];

    fakeClient.collections.setCurrentUser('user-123');
    playlists.forEach((it) => fakeClient.collections.addToFake(it));

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={asset.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');

    fireEvent.click(playlistButton);

    expect(wrapper.getByText('Loading playlists...')).toBeInTheDocument();
    expect(await wrapper.findByText('Playlist 1')).toBeInTheDocument();
  });

  it('clicking on playlist button opens popover that can be closed with X button', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={asset.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');
    fireEvent.click(playlistButton);

    fireEvent.click(await wrapper.findByLabelText('close add to playlist'));
    expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
  });

  it('there are only own and not shared playlists visible in popover', async () => {
    const fakeClient = new FakeBoclipsClient();

    const playlists = [
      CollectionFactory.sample({
        id: '1',
        title: 'Playlist 1',
        owner: 'user-123',
        mine: true,
      }),
      CollectionFactory.sample({
        id: '2',
        title: 'Playlist 2',
        owner: 'user-123',
        mine: true,
      }),
      CollectionFactory.sample({
        id: '3',
        title: 'Playlist 3',
        owner: 'different-user',
        mine: false,
      }),
    ];

    fakeClient.collections.setCurrentUser('user-123');
    playlists.forEach((it) => fakeClient.collections.addToFake(it));

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={asset.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');
    fireEvent.click(playlistButton);

    expect(await wrapper.findByText('Playlist 1')).toBeInTheDocument();
    expect(await wrapper.findByText('Playlist 2')).toBeInTheDocument();
    expect(wrapper.queryByText('Playlist 3')).not.toBeInTheDocument();
  });

  describe('traps focus in the pop-up', () => {
    it('focus on the first playlist from a list', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.setCurrentUser('user-123');
      const playlist = CollectionFactory.sample({
        id: 'playlist-id',
        title: 'Playlist 6777',
        owner: 'user-123',
        mine: true,
        assets: [asset],
      });
      fakeClient.collections.addToFake(playlist);

      const wrapper = render(
        <BoclipsClientProvider client={fakeClient}>
          <AddToPlaylistButton videoId={asset.id} />
        </BoclipsClientProvider>,
      );

      await waitFor(() =>
        wrapper.getByLabelText('Add or remove from playlist'),
      ).then((it) => {
        fireEvent.click(it);
      });

      await waitFor(() =>
        expect(
          wrapper.getByRole('checkbox', {
            name: 'Playlist 6777',
          }),
        ).toHaveFocus(),
      );

      await userEvent.tab();

      await waitFor(() =>
        expect(
          wrapper.getByRole('button', {
            name: 'Create new playlist',
          }),
        ).toHaveFocus(),
      );

      await userEvent.tab();

      expect(
        await wrapper.findByLabelText('close add to playlist'),
      ).toHaveFocus();
    });

    it('focus on create new playlist button when there are no playlists', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.setCurrentUser('user-123');

      const wrapper = render(
        <BoclipsClientProvider client={fakeClient}>
          <AddToPlaylistButton videoId={asset.id} />
        </BoclipsClientProvider>,
      );

      await waitFor(() => wrapper.getByLabelText('Add to playlist')).then(
        (it) => {
          fireEvent.click(it);
        },
      );

      await waitFor(() =>
        expect(
          wrapper.getByRole('button', {
            name: 'Create new playlist',
          }),
        ).toHaveFocus(),
      );

      await userEvent.tab();

      expect(
        await wrapper.findByLabelText('close add to playlist'),
      ).toHaveFocus();
    });

    it('closes the pop-up on escape key down', async () => {
      const fakeClient = new FakeBoclipsClient();

      const wrapper = render(
        <BoclipsClientProvider client={fakeClient}>
          <AddToPlaylistButton videoId={asset.id} />
        </BoclipsClientProvider>,
      );

      const playlistButton = await wrapper.findByLabelText('Add to playlist');
      fireEvent.click(playlistButton);

      expect(wrapper.getByTestId('add-to-playlist-pop-up')).toBeVisible();
      expect(wrapper.queryByText('Add to playlist')).toBeInTheDocument();

      fireEvent.keyDown(wrapper.getByTestId('add-to-playlist-pop-up'), {
        key: 'Escape',
      });

      expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
    });
  });

  it('video added event sent as Hotjar event', async () => {
    const fakeClient = new FakeBoclipsClient();
    const hotjarVideoAddedToPlaylist = jest.spyOn(
      AnalyticsFactory.hotjar(),
      'event',
    );
    const userId = 'user-100';
    const playlist = CollectionFactory.sample({
      id: 'playlist-332',
      title: 'Playlist 332',
      owner: userId,
      mine: true,
    });

    fakeClient.collections.setCurrentUser(userId);
    fakeClient.collections.addToFake(playlist);

    const wrapper = renderWrapper(fakeClient);

    const playlistButton = await wrapper.findByLabelText('Add to playlist');

    fireEvent.click(playlistButton);

    const playlistCheckbox = await wrapper.findByRole('checkbox', {
      name: playlist.title,
    });

    fireEvent.click(playlistCheckbox);

    await waitFor(() =>
      expect(hotjarVideoAddedToPlaylist).toHaveBeenCalledWith(
        HotjarEvents.VideoAddedToPlaylist.toString(),
      ),
    );
  });

  it('video removed event sent as Hotjar event', async () => {
    const fakeClient = new FakeBoclipsClient();
    const hotjarVideoRemovedFromPlaylist = jest.spyOn(
      AnalyticsFactory.hotjar(),
      'event',
    );
    const userId = 'user-2211';
    const playlist = CollectionFactory.sample({
      id: 'playlist-2222',
      title: 'Playlist 6777',
      owner: userId,
      mine: true,
      assets: [asset],
    });

    fakeClient.collections.setCurrentUser(userId);
    fakeClient.collections.addToFake(playlist);

    const wrapper = renderWrapper(fakeClient);

    await waitFor(() =>
      wrapper.getByLabelText('Add or remove from playlist'),
    ).then((it) => {
      fireEvent.click(it);
    });

    await waitFor(() =>
      wrapper.getByRole('checkbox', {
        name: playlist.title,
      }),
    ).then((it) => {
      fireEvent.click(it);
    });

    await waitFor(() =>
      expect(hotjarVideoRemovedFromPlaylist).toHaveBeenCalledWith(
        HotjarEvents.VideoRemovedFromPlaylist,
      ),
    );
  });

  it('invokes callback when removing video', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.setCurrentUser('user-123');

    fakeClient.collections.addToFake(
      CollectionFactory.sample({
        id: '123',
        owner: 'user-123',
        mine: true,
        assets: [asset],
        title: 'Courage the Cowardly Dog',
      }),
    );

    const mock = vi.fn();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={asset.id} onCleanup={mock} />
      </BoclipsClientProvider>,
    );

    fireEvent.click(
      await wrapper.findByLabelText('Add or remove from playlist'),
    );
    fireEvent.click(
      wrapper.getByRole('checkbox', { name: 'Courage the Cowardly Dog' }),
    );

    await waitFor(() => expect(mock).toHaveBeenCalled());
  });

  describe('create playlist', () => {
    it('shows create playlist modal', async () => {
      const wrapper = renderWrapper();

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));
      fireEvent.click(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      );
      expect(wrapper.getByTestId('playlist-modal')).toBeVisible();
    });

    it('hides the pop-up when create playlist modal is open', async () => {
      const wrapper = renderWrapper();

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));
      fireEvent.click(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      );
      expect(wrapper.getByTestId('playlist-modal')).toBeVisible();
      expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
    });

    it('can create playlist', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.setCurrentUser('user-123');
      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      fireEvent.click(
        await wrapper.findByLabelText('Add or remove from playlist'),
      );

      expect(
        await wrapper.findByRole('checkbox', { name: 'ornament' }),
      ).toBeChecked();
    });

    it('displays success notification on playlist creation', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.setCurrentUser('user-123');
      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'river');

      await waitForElementToBeRemoved(() =>
        wrapper.getByTestId('playlist-modal'),
      );

      expect(
        await wrapper.findByTestId('create-river-playlist'),
      ).toBeInTheDocument();
      expect(
        await wrapper.findByTestId('add-video-to-river-playlist'),
      ).toBeInTheDocument();
    });

    it('closes the modal and pop up on successful creation of playlist', async () => {
      const wrapper = renderWrapper();
      createPlaylist(wrapper, 'jazz');

      await waitFor(() =>
        expect(wrapper.queryByTestId('playlist-modal')).not.toBeInTheDocument(),
      );

      expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
    });

    it(`displays notification on failure`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.create = vi.fn(() => Promise.reject());
      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      expect(
        await wrapper.findByTestId('create-playlist-ornament-failed'),
      ).toBeVisible();
    });

    it('video added event sent to Hotjar', async () => {
      const fakeClient = new FakeBoclipsClient();
      const hotjarVideoAddedToPlaylist = vi.spyOn(
        AnalyticsFactory.hotjar(),
        'event',
      );
      const userId = 'user-100';

      fakeClient.collections.setCurrentUser(userId);

      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      await waitFor(() =>
        expect(hotjarVideoAddedToPlaylist).toHaveBeenCalledWith(
          HotjarEvents.VideoAddedToPlaylist.toString(),
        ),
      );
    });

    it('play list created event sent to Hotjar', async () => {
      const fakeClient = new FakeBoclipsClient();
      const hotjarPlaylistCreated = vi.spyOn(
        AnalyticsFactory.hotjar(),
        'event',
      );
      const userId = 'user-100';

      fakeClient.collections.setCurrentUser(userId);

      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      await waitFor(() =>
        expect(hotjarPlaylistCreated).toHaveBeenCalledWith(
          HotjarEvents.PlaylistCreatedFromVideo.toString(),
        ),
      );
    });

    const createPlaylist = (wrapper: RenderResult, playlistName: string) => {
      fireEvent.click(wrapper.getByLabelText('Add to playlist'));
      fireEvent.click(
        wrapper.getByRole('button', { name: 'Create new playlist' }),
      );
      fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
        target: { value: playlistName },
      });
      fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));
    };
  });

  const renderWrapper = (fakeClient = new FakeBoclipsClient()) => {
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <AddToPlaylistButton videoId={asset.id} />
      </BoclipsClientProvider>,
    );
  };
});
