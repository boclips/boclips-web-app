import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { fireEvent, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import HotjarFactory from 'src/services/hotjar/HotjarFactory';
import { Events } from 'src/services/hotjar/Events';

describe('Add to playlist button', () => {
  const video = VideoFactory.sample({
    title: 'video killed the radio star',
  });

  it('displays info if there is no playlists', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');

    fireEvent.click(playlistButton);

    expect(
      await wrapper.findByText('You have no playlists yet'),
    ).toBeInTheDocument();
  });

  it('clicking on playlist button opens popover that can be closed with X button', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
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
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');
    fireEvent.click(playlistButton);

    expect(await wrapper.findByText('Playlist 1')).toBeInTheDocument();
    expect(await wrapper.findByText('Playlist 2')).toBeInTheDocument();
    expect(wrapper.queryByText('Playlist 3')).not.toBeInTheDocument();
  });

  it('traps focus in the pop-up', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.setCurrentUser('user-123');

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');
    fireEvent.click(playlistButton);

    userEvent.tab();

    expect(
      await wrapper.findByLabelText('close add to playlist'),
    ).toHaveFocus();
    userEvent.tab();

    expect(
      await wrapper.findByRole('button', {
        name: 'Create new playlist',
      }),
    ).toHaveFocus();

    userEvent.tab();

    expect(
      await wrapper.findByLabelText('close add to playlist'),
    ).toHaveFocus();
  });

  it('closes the pop-up on escape key down', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
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

  it('video added event sent as Hotjar event', async () => {
    const fakeClient = new FakeBoclipsClient();
    const hotjarVideoAddedToPlaylist = jest.spyOn(
      HotjarFactory.hotjar(),
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

    const playlistCheckbox = await wrapper.findByLabelText(playlist.title);

    fireEvent.click(playlistCheckbox);

    await waitFor(() =>
      expect(hotjarVideoAddedToPlaylist).toHaveBeenCalledWith(
        Events.VideoAddedToPlaylist.toString(),
      ),
    );
  });

  it('video removed event sent as Hotjar event', async () => {
    const fakeClient = new FakeBoclipsClient();
    const hotjarVideoRemovedFromPlaylist = jest.spyOn(
      HotjarFactory.hotjar(),
      'event',
    );
    const userId = 'user-2211';
    const playlist = CollectionFactory.sample({
      id: 'playlist-2222',
      title: 'Playlist 6777',
      owner: userId,
      mine: true,
      videos: [video],
    });

    fakeClient.collections.setCurrentUser(userId);
    fakeClient.collections.addToFake(playlist);

    const wrapper = renderWrapper(fakeClient);

    const playlistButton = await wrapper.findByLabelText('Add to playlist');

    fireEvent.click(playlistButton);

    const playlistCheckbox = await wrapper.findByLabelText(playlist.title);

    fireEvent.click(playlistCheckbox);

    await waitFor(() =>
      expect(hotjarVideoRemovedFromPlaylist).toHaveBeenCalledWith(
        Events.VideoRemovedFromPlaylist,
      ),
    );
  });

  describe('create playlist', () => {
    it('shows create playlist modal', async () => {
      const wrapper = renderWrapper();

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));
      fireEvent.click(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      );
      expect(wrapper.getByTestId('create-playlist-modal')).toBeVisible();
    });

    it('hides the pop-up when create playlist modal is open', async () => {
      const wrapper = renderWrapper();

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));
      fireEvent.click(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      );
      expect(wrapper.getByTestId('create-playlist-modal')).toBeVisible();
      expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
    });

    it('can create playlist', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.setCurrentUser('user-123');
      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));
      expect(
        await wrapper.findByRole('checkbox', { name: 'ornament' }),
      ).toBeChecked();
    });

    it('displays success notification on playlist creation', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.setCurrentUser('user-123');
      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'river');

      expect(await wrapper.findByTestId('create-river-playlist')).toBeVisible();

      expect(
        await wrapper.findByTestId('add-video-to-river-playlist'),
      ).toBeVisible();
    });

    it('closes the modal and pop up on successful creation of playlist', async () => {
      const wrapper = renderWrapper();
      createPlaylist(wrapper, 'jazz');

      await waitFor(() =>
        expect(
          wrapper.queryByTestId('create-playlist-modal'),
        ).not.toBeInTheDocument(),
      );

      expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
    });

    it(`displays notification on failure`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.collections.create = jest.fn(() => Promise.reject());
      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      expect(
        await wrapper.findByTestId('create-playlist-ornament-failed'),
      ).toBeVisible();
    });

    it('video added event sent to Hotjar', async () => {
      const fakeClient = new FakeBoclipsClient();
      const hotjarVideoAddedToPlaylist = jest.spyOn(
        HotjarFactory.hotjar(),
        'event',
      );
      const userId = 'user-100';

      fakeClient.collections.setCurrentUser(userId);

      const wrapper = renderWrapper(fakeClient);

      createPlaylist(wrapper, 'ornament');

      fireEvent.click(await wrapper.findByLabelText('Add to playlist'));

      await waitFor(() =>
        expect(hotjarVideoAddedToPlaylist).toHaveBeenCalledWith(
          Events.VideoAddedToPlaylist.toString(),
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
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );
  };
});
