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
import { QueryClient } from 'react-query';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Link } from 'boclips-api-client/dist/types';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Constants } from 'src/AppConstants';
import HotjarFactory from 'src/services/hotjar/HotjarFactory';
import { HotjarEvents } from 'src/services/hotjar/Events';

const insertUser = (client: FakeBoclipsClient) =>
  client.users.insertCurrentUser(UserFactory.sample());

const renderLibraryView = (client: BoclipsClient) =>
  render(
    <MemoryRouter initialEntries={['/library']}>
      <App
        apiClient={client}
        boclipsSecurity={stubBoclipsSecurity}
        reactQueryClient={new QueryClient()}
      />
    </MemoryRouter>,
  );

describe('LibraryView', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('loads the title for library page', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);
    const wrapper = renderLibraryView(client);
    expect(await wrapper.findByTitle('Your Library')).toBeVisible();
  });

  it('renders playlists created by the user', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);

    const playlists = [
      CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
      CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
    ];

    playlists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderLibraryView(client);

    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.findByText('Playlist 2')).toBeVisible();
  });

  it('displays shared playlists', async () => {
    const client = new FakeBoclipsClient();
    insertUser(client);

    const playlists = [
      CollectionFactory.sample({ id: '1', title: 'Playlist 1', mine: false }),
    ];

    playlists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderLibraryView(client);

    expect(await wrapper.findByText('Playlist 1')).toBeVisible();
    expect(await wrapper.findByText('Shared with you')).toBeVisible();
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

    const wrapper = renderLibraryView(client);

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

    const wrapper = renderLibraryView(client);

    expect(await wrapper.findByText('My collection about cats')).toBeVisible();
    expect(wrapper.getByLabelText('Thumbnail of Title 1')).toBeVisible();
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

    const wrapper = renderLibraryView(client);

    expect(await wrapper.findByText('My collection about cats')).toBeVisible();
    expect(wrapper.getByLabelText('Thumbnail of Title 1')).toBeVisible();
    expect(wrapper.getByTestId('default-thumnail-2')).toBeVisible();
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
      const wrapper = renderLibraryView(client);

      expect(
        await wrapper.findByRole('button', { name: 'Create new playlist' }),
      ).toBeVisible();
    });

    it('opens a modal when clicking the Create new playlist button', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderLibraryView(client);

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
      const wrapper = renderLibraryView(client);

      await openPlaylistCreationModal(wrapper);

      fireEvent.click(wrapper.getByRole('button', { name: 'Cancel' }));

      const modal = wrapper.queryByLabelText('Create new playlist');
      expect(modal).not.toBeInTheDocument();
    });

    it('cannot create a playlist without a title', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderLibraryView(client);

      await openPlaylistCreationModal(wrapper);

      fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));
      const modal = wrapper.queryByLabelText('Create new playlist');
      expect(modal).toBeVisible();
      expect(wrapper.getByText('Playlist name is required')).toBeVisible();
    });

    it('can create a playlist with title and description', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderLibraryView(client);

      await openPlaylistCreationModal(wrapper);
      fillPlaylistName(wrapper, 'My new playlist');
      fillPlaylistDescription(wrapper, 'Blabla new playlist');
      confirmPlaylistCreationModal(wrapper);

      await waitForElementToBeRemoved(
        wrapper.queryByLabelText('Create new playlist'),
      );

      expect(await wrapper.findByText('My new playlist')).toBeVisible();
      expect(await wrapper.findByText('Blabla new playlist')).toBeVisible();
    });

    it('sends playlist created Hotjar event', async () => {
      const hotjarPlaylistCreated = jest.spyOn(HotjarFactory.hotjar(), 'event');

      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderLibraryView(client);

      await openPlaylistCreationModal(wrapper);

      fillPlaylistName(wrapper, 'My new playlist');
      fillPlaylistDescription(wrapper, 'Blabla new playlist');
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
      const wrapper = renderLibraryView(client);
      client.collections.setCreateCollectionErrorMessage('500 server error');

      await openPlaylistCreationModal(wrapper);
      fillPlaylistName(wrapper, 'My new playlist');
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
      const wrapper = renderLibraryView(client);

      await openPlaylistCreationModal(wrapper);
      fillPlaylistName(wrapper, 'My new playlist');
      confirmPlaylistCreationModal(wrapper);

      fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

      await waitFor(() => {
        expect(wrapper.getByTestId('spinner')).toBeInTheDocument();
      });
    });

    it(`returns focus to create playlist button after playlist creation cancelled`, async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderLibraryView(client);
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
