import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
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
import PlaylistView from 'src/views/playlist/PlaylistView';
import { FollowPlaylist } from 'src/services/followPlaylist';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { CollectionFactory as collectionFactory } from 'src/testSupport/CollectionFactory';
import { sleep } from 'src/testSupport/sleep';

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
    owner: 'myuserid',
    mine: true,
  });

  beforeEach(() => {
    client.collections.clear();
    client.carts.clear();
    client.videos.clear();

    videos.forEach((it) => client.videos.insertVideo(it));
    client.collections.setCurrentUser('myuserid');
    client.users.insertCurrentUser(
      UserFactory.sample({
        id: 'myuserid',
      }),
    );
    client.collections.addToFake(playlist);
  });

  it("shows Playlist's title and description if user can access", async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId('playlistTitle')).toBeVisible();
    expect(await screen.findByText('Very nice description')).toBeVisible();
  });

  it('displays video title for all videos in the playlist', async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/123']}>
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
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId(videos[0].id)).toBeVisible();
    expect(await screen.findByTestId(videos[1].id)).toBeVisible();
    expect(await screen.findByTestId(videos[2].id)).toBeVisible();
    expect(await screen.findByTestId(videos[3].id)).toBeVisible();
    expect(await screen.findByTestId(videos[4].id)).toBeVisible();
  });

  it('navigates to the video page when clicked on video', async () => {
    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

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

  it('video can be added to cart by clicking the button', async () => {
    client.carts.clear();
    client.collections.clear();
    const video = createVideoWithThumbnail('111', 'Video One');
    client.videos.insertVideo(video);
    client.collections.addToFake({ ...playlist, videos: [video] });

    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    fireEvent.click(await screen.findByTestId('add-to-cart-button'));

    await waitFor(async () => {
      expect((await client.carts.getCart()).items[0].videoId).toEqual('111');
    });
  });

  it('video can be removed from cart by clicking the button', async () => {
    client.videos.clear();
    client.videos.insertVideo(createVideoWithThumbnail('111', 'Video One'));
    await client.carts.addItemToCart(await client.carts.getCart(), '111');
    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    fireEvent.click(await screen.findByTestId('remove-from-cart-button'));

    await waitFor(async () => {
      expect((await client.carts.getCart()).items).toHaveLength(0);
    });
  });

  it('video can be removed from the playlist', async () => {
    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    await screen.findByText('Video One 111');

    const videoToRemove = screen.getByTestId('grid-card-for-Video One 111');
    const videoToRemoveButton = within(videoToRemove).getByRole('button', {
      name: 'Add or remove from playlist',
    });

    fireEvent.click(videoToRemoveButton);

    const playlistCheckbox = screen.getByRole('checkbox', {
      name: 'Hello there',
    });

    fireEvent.click(playlistCheckbox);

    await waitForElementToBeRemoved(screen.queryByText('Video One 111'));
    const remainingVideos = screen.getAllByLabelText(
      'Add or remove from playlist',
    );
    expect(remainingVideos).toHaveLength(4);
  });

  describe('following a playlist', () => {
    beforeEach(() => {
      client.collections.clear();
    });

    it(`invokes bookmark command when playlist is opened`, async () => {
      client.collections.addToFake(playlist);

      const bookmarkService = new FollowPlaylist(client.collections);
      const bookmarkFunction = jest.spyOn(bookmarkService, 'follow');

      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      render(
        <Router history={history}>
          <Route path="/playlists/:id">
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <BoclipsClientProvider client={client}>
                <QueryClientProvider client={new QueryClient()}>
                  <PlaylistView followPlaylist={bookmarkService} />
                </QueryClientProvider>
              </BoclipsClientProvider>
            </BoclipsSecurityProvider>
          </Route>
        </Router>,
      );

      await waitFor(() => {
        expect(bookmarkFunction).toHaveBeenCalledWith(playlist);
      });
    });

    it(`shows toast notification when playlist is bookmarked`, async () => {
      const bookmarkablePlaylist = CollectionFactory.sample({
        id: '111',
        title: 'Hello test',
        description: 'Very nice description',
        videos,
        owner: 'myuserid',
        mine: false,
        links: collectionFactory.sampleLinks({}),
      });

      client.collections.addToFake(bookmarkablePlaylist);

      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/111' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      expect(
        await wrapper.findByText(
          "Playlist 'Hello test' has been added to your Library",
        ),
      ).toBeVisible();
    });

    it(`does not display notification when playlist is already bookmarked`, async () => {
      const alreadyBookmarkedPlaylist = CollectionFactory.sample({
        id: '222',
        title: 'Hello test',
        description: 'Very nice description',
        videos,
        owner: 'myuserid',
        mine: false,
        links: collectionFactory.sampleLinks({
          bookmark: undefined,
          unbookmark: new Link({
            href: 'https://api.boclips.com/v1/collections/1?bookmarked=false',
          }),
        }),
      });

      client.collections.addToFake(alreadyBookmarkedPlaylist);

      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/222' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      // Wait until the toast is (potentially) rendered
      await sleep(1000);

      expect(
        wrapper.queryByText(
          "Playlist 'Hello test' has been added to your Library",
        ),
      ).toBeNull();
    });
  });

  describe('editing a playlist', () => {
    it('edit playlist button is not visible for playlists shared with me by other user', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      const editPlaylistButton = await wrapper.findByText('Edit playlist');
      fireEvent.click(editPlaylistButton);

      const editPlaylistPopup = await wrapper.findByTestId('playlist-modal');
      expect(editPlaylistPopup).toBeVisible();
      expect(
        await within(editPlaylistPopup).findByText('Edit playlist'),
      ).toBeVisible();
      expect(
        await within(editPlaylistPopup).findByDisplayValue('Hello there'),
      ).toBeVisible();
      expect(
        await within(editPlaylistPopup).findByDisplayValue(
          'Very nice description',
        ),
      ).toBeVisible();
    });

    it('edit playlist popup is displayed with populated values when edit button is clicked', async () => {
      const sharedPlaylist = { ...playlist, id: '321', mine: false };
      client.collections.addToFake(sharedPlaylist);
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/321' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      await waitForPlaylistToBeLoaded(wrapper);
      const editPlaylistButton = wrapper.queryByText('Edit playlist');
      expect(editPlaylistButton).toBeNull();
    });

    it('can edit playlist', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByText('Edit playlist'));

      fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
        target: { value: 'Good bye' },
      });
      fireEvent.change(wrapper.getByDisplayValue('Very nice description'), {
        target: { value: 'Not that nice description' },
      });

      fireEvent.click(wrapper.getByText('Save'));

      expect(await wrapper.findByTestId('edit-playlist-success')).toBeVisible();
      expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
        'Good bye',
      );
      expect(
        await wrapper.findByTestId('playlistDescription'),
      ).toHaveTextContent('Not that nice description');

      const updatedPlaylist = await client.collections.get('123');
      expect(updatedPlaylist.title).toBe('Good bye');
      expect(updatedPlaylist.description).toBe('Not that nice description');

      const editPlaylistModal = wrapper.queryByTestId('playlist-modal');
      expect(editPlaylistModal).toBeNull();
    });

    it('edited playlist title is updated also in add to playlist modal', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByText('Edit playlist'));

      fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
        target: { value: 'Good bye' },
      });

      fireEvent.click(wrapper.getByText('Save'));

      expect(await wrapper.findByTestId('edit-playlist-success')).toBeVisible();
      expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
        'Good bye',
      );

      const videoOne = wrapper.getByTestId('grid-card-for-Video One 111');
      const addToPlaylistButton = within(videoOne).getByRole('button', {
        name: 'Add or remove from playlist',
      });
      fireEvent.click(addToPlaylistButton);

      const addToPlaylistModal = await wrapper.findByTestId(
        'add-to-playlist-pop-up',
      );
      expect(
        await within(addToPlaylistModal).findByText('Good bye'),
      ).toBeVisible();
    });

    it('edited playlist title is updated also in navigation breadcrumbs', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByText('Edit playlist'));

      fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
        target: { value: 'Good bye' },
      });

      fireEvent.click(wrapper.getByText('Save'));

      expect(await wrapper.findByTestId('edit-playlist-success')).toBeVisible();
      expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
        'Good bye',
      );

      expect(
        await wrapper.findByTestId('playlist-title-link'),
      ).toHaveTextContent('Good bye');
    });

    it('changes are not saved when playlist editing is cancelled', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByText('Edit playlist'));

      fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
        target: { value: 'Good bye' },
      });
      fireEvent.change(wrapper.getByDisplayValue('Very nice description'), {
        target: { value: 'Not that nice description' },
      });

      fireEvent.click(wrapper.getByText('Cancel'));

      expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
        'Hello there',
      );
      expect(
        await wrapper.findByTestId('playlistDescription'),
      ).toHaveTextContent('Very nice description');

      const updatedPlaylist = await client.collections.get('123');
      expect(updatedPlaylist.title).toBe('Hello there');
      expect(updatedPlaylist.description).toBe('Very nice description');

      const editPlaylistModal = wrapper.queryByTestId('playlist-modal');
      expect(editPlaylistModal).toBeNull();
    });

    it('notification is displayed when playlist edit fails', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      client.collections.update = jest.fn(() => Promise.reject());

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByText('Edit playlist'));

      fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
        target: { value: 'Good bye' },
      });

      fireEvent.click(wrapper.getByText('Save'));

      expect(await wrapper.findByTestId('edit-playlist-failed')).toBeVisible();

      expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
        'Hello there',
      );
      expect(
        await wrapper.findByTestId('playlistDescription'),
      ).toHaveTextContent('Very nice description');

      const editPlaylistModal = wrapper.queryByTestId('playlist-modal');
      expect(editPlaylistModal).toBeVisible();
    });

    it('warning is displayed when required title not provided', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByText('Edit playlist'));

      fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
        target: { value: '' },
      });

      fireEvent.click(wrapper.getByText('Save'));

      expect(
        await wrapper.findByText('Playlist name is required'),
      ).toBeVisible();
    });
  });

  describe('playlist navigation', () => {
    it('navigation link contains playlist title', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      expect(
        await wrapper.findByTestId('playlist-title-link'),
      ).toHaveTextContent('Hello there');
    });

    it('navigates back to library when library link clicked', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      fireEvent.click(await wrapper.findByTestId('to-library-link'));

      expect(history.location.pathname).toEqual('/library');
    });

    it('navigates to playlist page when title link clicked', async () => {
      const history = createBrowserHistory();
      history.push({ pathname: '/playlists/123' });

      const wrapper = render(
        <Router history={history}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </Router>,
      );

      const titleLink = await wrapper.findByTestId('playlist-title-link');
      fireEvent.click(titleLink);

      expect(history.location.pathname).toEqual('/playlists/123');
    });
  });

  const waitForPlaylistToBeLoaded = async (wrapper: RenderResult) =>
    wrapper.findByTestId('playlistTitle');
});
