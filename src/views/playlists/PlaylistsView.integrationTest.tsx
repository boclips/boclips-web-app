import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClient } from 'boclips-api-client';
import userEvent from '@testing-library/user-event';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { QueryClient } from '@tanstack/react-query';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Constants } from 'src/AppConstants';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';

const insertUser = (client: FakeBoclipsClient) =>
  client.users.insertCurrentUser(UserFactory.sample());

const renderPlaylistsView = (client: BoclipsClient) =>
  render(
    <MemoryRouter initialEntries={['/playlists']}>
      <App
        apiClient={client}
        boclipsSecurity={stubBoclipsSecurity}
        reactQueryClient={new QueryClient()}
      />
    </MemoryRouter>,
  );

describe('PlaylistsView', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('loads the title for playlists page', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    const wrapper = renderPlaylistsView(client);
    expect(await wrapper.findByTitle('Playlists')).toBeVisible();
  });

  it('renders playlists created by the user', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);

    const playlists = [
      CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
      CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
    ];

    playlists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderPlaylistsView(client);

    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.findByText('Playlist 2')).toBeVisible();

    expect(await wrapper.findAllByText('By: You')).toHaveLength(2);
  });

  it('displays shared playlists', async () => {
    const client = new FakeBoclipsClient();

    const playlist = CollectionFactory.sample({
      id: '1',
      title: 'Playlist 1',
      mine: false,
      ownerName: 'The Owner',
    });
    client.collections.addToFake(playlist);
    await client.collections.bookmark(playlist);

    const wrapper = renderPlaylistsView(client);

    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.findByText('Shared with you')).toBeVisible();

    expect(await wrapper.findByText('By: The Owner')).toBeVisible();
  });

  it('can search for playlist', async () => {
    const client = new FakeBoclipsClient();

    const myPlaylists = [
      CollectionFactory.sample({
        id: '1',
        mine: true,
        title: 'My playlist about apples',
      }),
      CollectionFactory.sample({
        id: '2',
        mine: true,
        title: 'My playlist about pears',
      }),
      CollectionFactory.sample({
        id: '3',
        mine: false,
        title: 'Shared pears playlist',
        ownerName: 'The Owner',
        links: {
          self: new Link({
            href: 'https://api.boclips.com/v1/collections/1',
          }),
          unbookmark: new Link({
            href: 'https://api.staging-boclips.com/v1/collections/623707aa9d7ac66705d8b280?bookmarked=false',
          }),
        },
      }),
    ];

    myPlaylists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderPlaylistsView(client);

    expect(await wrapper.findByText('My playlist about apples')).toBeVisible();
    expect(await wrapper.findByText('My playlist about pears')).toBeVisible();
    expect(await wrapper.findByText('Shared pears playlist')).toBeVisible();

    const searchInput = wrapper.getByPlaceholderText('Search for playlists');
    await userEvent.type(searchInput, 'pears');

    await waitForElementToBeRemoved(() =>
      wrapper.getByText('My playlist about apples'),
    );

    expect(await wrapper.findByText('My playlist about pears')).toBeVisible();
    expect(await wrapper.findByText('Shared pears playlist')).toBeVisible();
  });

  it('has a share button that copies playlist link to clipboard', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => Promise.resolve(),
      },
    });

    jest.spyOn(navigator.clipboard, 'writeText');

    const client = new FakeBoclipsClient();
    insertUser(client);

    const playlists = [
      CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
      CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
    ];

    playlists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderPlaylistsView(client);

    const shareButton = await wrapper.findByTestId(`share-playlist-button-1`);

    await act(async () => {
      fireEvent.click(shareButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${Constants.HOST}/playlists/1`,
    );
  });

  it('displays first 3 thumbnails', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);

    const videos = [
      createVideoWithThumbnail('1'),
      createVideoWithThumbnail('2'),
      createVideoWithThumbnail('3'),
      createVideoWithThumbnail('4'),
    ];

    const playlist = CollectionFactory.sample({
      id: '1',
      title: 'My collection about cats',
      videos,
    });

    client.collections.addToFake(playlist);
    videos.forEach((it) => client.videos.insertVideo(it));

    const wrapper = renderPlaylistsView(client);

    expect(await wrapper.findByText('My collection about cats')).toBeVisible();
    expect(await wrapper.findByLabelText('Thumbnail of Title 1')).toBeVisible();
    expect(wrapper.getByLabelText('Thumbnail of Title 2')).toBeVisible();
    expect(wrapper.getByLabelText('Thumbnail of Title 3')).toBeVisible();
    expect(wrapper.queryByLabelText('Thumbnail of Title 4')).toBeNull();
  });

  it('displays default thumbnail if there is less than 3 videos in a playlist', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);

    const videos = [
      createVideoWithThumbnail('1'),
      createVideoWithThumbnail('2'),
    ];

    const playlist = CollectionFactory.sample({
      id: '1',
      title: 'My collection about cats',
      videos,
    });

    client.collections.addToFake(playlist);
    videos.forEach((it) => client.videos.insertVideo(it));

    const wrapper = renderPlaylistsView(client);

    expect(await wrapper.findByText('My collection about cats')).toBeVisible();
    expect(await wrapper.findByLabelText('Thumbnail of Title 1')).toBeVisible();
    expect(wrapper.getByTestId('default-thumbnail-2')).toBeVisible();
  });

  const createVideoWithThumbnail = (id: string) => {
    return VideoFactory.sample({
      id,
      title: `Title ${id}`,
      playback: PlaybackFactory.sample({
        links: {
          thumbnail: new Link({ href: 'http://thumbnail.jpg' }),
          createPlayerInteractedWithEvent: new Link({ href: 'todo' }),
        },
      }),
    });
  };

  describe('Creating playlists', () => {
    it('shows Create new playlist button', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      expect(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      ).toBeVisible();
    });

    it('opens a modal when clicking the Create new playlist button', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      const createPlaylistButton = await wrapper.findByRole('button', {
        name: 'Create new playlist',
      });

      expect(wrapper.queryByLabelText('Create new playlist')).toBeNull();

      fireEvent.click(createPlaylistButton);

      expect(wrapper.getByLabelText('Create new playlist')).toBeVisible();
      expect(wrapper.getByLabelText('Playlist name')).toBeVisible();
      expect(wrapper.getByLabelText('Playlist name')).toHaveFocus();
      expect(wrapper.getByPlaceholderText('Add name')).toBeVisible();
      expect(wrapper.getByLabelText('Description (Optional)')).toBeVisible();
      expect(wrapper.getByPlaceholderText('Add description')).toBeVisible();
      expect(wrapper.getByRole('button', { name: 'Cancel' })).toBeVisible();
      expect(
        wrapper.getByRole('button', { name: 'Create new playlist' }),
      ).toBeVisible();
    });

    it('can cancel modal', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      fireEvent.click(wrapper.getByRole('button', { name: 'Cancel' }));

      const modal = wrapper.queryByLabelText('Create new playlist');
      expect(modal).not.toBeInTheDocument();
    });

    it('cannot create a playlist without a title', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));
      const modal = wrapper.queryByLabelText('Create new playlist');
      expect(modal).toBeVisible();
      expect(wrapper.getByText('Playlist name is required')).toBeVisible();
    });

    it('can create a playlist with title and description', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
        target: { value: 'new playlist name' },
      });

      fireEvent.change(wrapper.getByPlaceholderText('Add description'), {
        target: { value: 'Blabla new playlist' },
      });

      confirmPlaylistCreationModal(wrapper);

      await waitFor(() =>
        expect(wrapper.getByTestId('playlistTitle')).toHaveTextContent(
          'new playlist name',
        ),
      );

      expect(await wrapper.getByText('Blabla new playlist')).toBeVisible();
    });

    it('sends playlist created Hotjar event', async () => {
      const hotjarPlaylistCreated = jest.spyOn(
        AnalyticsFactory.hotjar(),
        'event',
      );

      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      await fillPlaylistName(wrapper, 'My new playlist');
      await fillPlaylistDescription(wrapper, 'Blabla new playlist');
      confirmPlaylistCreationModal(wrapper);

      await waitFor(() =>
        expect(hotjarPlaylistCreated).toHaveBeenCalledWith(
          HotjarEvents.PlaylistCreatedFromLibrary.toString(),
        ),
      );
    });

    it('can display an error message on failed playlist creation', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);
      client.collections.setCreateCollectionErrorMessage('500 server error');

      await openPlaylistCreationModal(wrapper);
      await fillPlaylistName(wrapper, 'My new playlist');
      confirmPlaylistCreationModal(wrapper);

      expect(
        await wrapper.findByText('Error: Failed to create new playlist'),
      ).toBeVisible();
      expect(
        await wrapper.findByText('Please refresh the page and try again'),
      ).toBeVisible();
    });

    it('display spinner in confirm button after creating playlist', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);
      await fillPlaylistName(wrapper, 'My new playlist');
      confirmPlaylistCreationModal(wrapper);

      await waitFor(() => {
        expect(wrapper.getByTestId('spinner')).toBeInTheDocument();
      });
    });

    it(`returns focus to create playlist button after playlist creation cancelled`, async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);
      await openPlaylistCreationModal(wrapper);

      fireEvent.keyDown(wrapper.getByRole('dialog'), { key: 'Escape' });

      expect(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      ).toHaveFocus();
    });

    const openPlaylistCreationModal = async (wrapper: RenderResult) =>
      fireEvent.click(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      );

    const fillPlaylistField = (
      wrapper: RenderResult,
      label: string,
      value: string,
    ) => userEvent.type(wrapper.getByLabelText(label), value);

    const fillPlaylistName = (wrapper: RenderResult, value: string) =>
      fillPlaylistField(wrapper, 'Playlist name', value);

    const fillPlaylistDescription = (wrapper: RenderResult, value: string) =>
      fillPlaylistField(wrapper, 'Description (Optional)', value);

    const confirmPlaylistCreationModal = (wrapper: RenderResult) =>
      fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));
  });
});
