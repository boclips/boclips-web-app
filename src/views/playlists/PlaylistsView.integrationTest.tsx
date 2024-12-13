import {
  render,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '@src/App';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClient } from 'boclips-api-client';
import userEvent from '@testing-library/user-event';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { QueryClient } from '@tanstack/react-query';
import { Constants } from '@src/AppConstants';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { lastEvent } from '@src/testSupport/lastEvent';

const insertUser = (client: FakeBoclipsClient, product?: Product) => {
  const user = UserFactory.sample({
    id: 'user-1',
    account: {
      ...UserFactory.sample().account,
      id: 'acc-1',
      name: 'Ren',
      products: [product],
      type: AccountType.STANDARD,
    },
  });
  client.users.insertCurrentUser(user);
  return user;
};

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
    expect(
      await wrapper.findByText(
        'Create, search and share your own video playlists, as well as playlists that have been shared with you by your friends or colleagues, and featured playlists that have been curated by Boclips.',
      ),
    ).toBeVisible();
  });

  describe('Playlist tabs', () => {
    let client: FakeBoclipsClient;

    beforeEach(() => {
      client = new FakeBoclipsClient();
      const user = insertUser(client);
      client.collections.setCurrentUser(user.id);

      const playlists = [
        CollectionFactory.sample({
          id: '1',
          title: 'Playlist 1',
          owner: user.id,
          mine: true,
        }),
        CollectionFactory.sample({
          id: '2',
          title: 'Playlist 2',
          owner: user.id,
          mine: true,
        }),
      ];

      playlists.forEach((it) => client.collections.addToFake(it));

      const sharedPlaylist = CollectionFactory.sample({
        id: '3',
        title: 'Bob made this Playlist',
        mine: false,
        ownerName: 'Bob',
      });
      client.collections.addToFake(sharedPlaylist);
      client.collections.bookmark(sharedPlaylist);

      const boclipsPlaylist = CollectionFactory.sample({
        id: '4',
        title: 'Boclips made this Playlist',
        mine: false,
        ownerName: 'Eve',
        createdBy: 'Boclips',
      });
      client.collections.addToFake(boclipsPlaylist);
      client.collections.bookmark(boclipsPlaylist);
    });

    it('renders playlists tabs', async () => {
      const wrapper = renderPlaylistsView(client);

      expect(await wrapper.findByText('My playlists')).toBeVisible();
      expect(await wrapper.findByText('Shared with you')).toBeVisible();
      expect(await wrapper.findByText('Boclips featured')).toBeVisible();
    });

    it('renders playlists created by the user', async () => {
      const wrapper = renderPlaylistsView(client);

      await userEvent.click(await wrapper.findByText('My playlists'));
      expect(await wrapper.findByText('Playlist 1')).toBeVisible();
      expect(await wrapper.findByText('Playlist 2')).toBeVisible();
      expect(wrapper.queryByText('Bob made this Playlist')).toBeNull();
      expect(wrapper.queryByText('Boclips made this Playlist')).toBeNull();

      expect(await wrapper.findAllByText('By: You')).toHaveLength(2);
    });

    it('displays shared playlists', async () => {
      const wrapper = renderPlaylistsView(client);

      await userEvent.click(
        await wrapper.findByRole('tab', { name: 'Shared with you' }),
      );
      expect(await wrapper.findByText('Bob made this Playlist')).toBeVisible();
      expect(await wrapper.findByText('By: Bob')).toBeVisible();
      expect(wrapper.queryByText('Playlist 1')).toBeNull();
      expect(wrapper.queryByText('Boclips made this Playlist')).toBeNull();
    });

    it('displays Boclips playlists and their owner as Boclips for external users', async () => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            id: 'acc-12',
            name: 'External Account',
            type: AccountType.STANDARD,
            products: [Product.LIBRARY],
            createdAt: new Date(),
          },
        }),
      );
      const wrapper = renderPlaylistsView(client);

      await userEvent.click(
        await wrapper.findByRole('tab', { name: 'Boclips featured' }),
      );
      expect(
        await wrapper.findByText('Boclips made this Playlist'),
      ).toBeVisible();
      expect(await wrapper.findByText('By: Boclips')).toBeVisible();
      expect(wrapper.queryByText('Playlist 1')).toBeNull();
      expect(wrapper.queryByText('Bob made this Playlist')).toBeNull();
    });

    it('displays Boclips playlists and their owner as ownerName (Boclips) for internal users', async () => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            id: 'acc-1',
            name: 'Boclips',
            type: AccountType.STANDARD,
            products: [Product.LIBRARY],
            createdAt: new Date(),
          },
        }),
      );
      const wrapper = renderPlaylistsView(client);

      await userEvent.click(
        await wrapper.findByRole('tab', { name: 'Boclips featured' }),
      );
      expect(
        await wrapper.findByText('Boclips made this Playlist'),
      ).toBeVisible();
      expect(await wrapper.findByText('By: Eve (Boclips)')).toBeVisible();
      expect(wrapper.queryByText('Playlist 1')).toBeNull();
      expect(wrapper.queryByText('Bob made this Playlist')).toBeNull();
    });

    it(`emits events when clicking shared, boclips and my playlists tabs`, async () => {
      const wrapper = renderPlaylistsView(client);

      await userEvent.click(
        await wrapper.findByRole('tab', { name: 'Boclips featured' }),
      );

      expect(
        await wrapper.findByText('Boclips made this Playlist'),
      ).toBeVisible();

      await waitFor(() => {
        expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'BOCLIPS_SHARED_PLAYLISTS_TAB_OPENED',
          anonymous: false,
        });
      });

      await userEvent.click(
        await wrapper.findByRole('tab', { name: 'Shared with you' }),
      );

      await waitFor(() => {
        expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'USER_SHARED_PLAYLISTS_TAB_OPENED',
          anonymous: false,
        });
      });
    });
  });

  it.skip('can search for playlist with separate tabs result', async () => {
    const client = new FakeBoclipsClient();
    const user = insertUser(client);
    client.collections.setCurrentUser(user.id);

    const myPlaylists = [
      CollectionFactory.sample({
        id: '1',
        mine: true,
        title: 'Apples',
        owner: user.id,
      }),
      CollectionFactory.sample({
        id: '2',
        mine: true,
        title: 'pears',
        owner: user.id,
      }),
      CollectionFactory.sample({
        id: '3',
        mine: false,
        title: 'Shared pears',
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
      CollectionFactory.sample({
        id: '4',
        mine: false,
        title: 'Boclips loves pears',
        ownerName: 'Some owner',
        createdBy: 'Boclips',
        links: {
          self: new Link({
            href: 'https://api.boclips.com/v1/collections/4',
          }),
          unbookmark: new Link({
            href: 'https://api.staging-boclips.com/v1/collections/623707aa9d7ac66705d8b280?bookmarked=false',
          }),
        },
      }),
    ];

    myPlaylists.forEach((it) => client.collections.addToFake(it));

    const wrapper = renderPlaylistsView(client);

    const searchInput = await wrapper.findByPlaceholderText(
      'Search for playlists',
    );
    await userEvent.type(searchInput, 'pears');

    await userEvent.click(
      await wrapper.findByRole('tab', { name: 'My playlists' }),
    );
    await waitForElementToBeRemoved(() => wrapper.getByText('Apples'));
    expect(await wrapper.findByText('pears')).toBeVisible();

    await userEvent.click(
      await wrapper.findByRole('tab', { name: 'Shared with you' }),
    );
    expect(await wrapper.findByText('Shared pears')).toBeVisible();

    await userEvent.click(
      await wrapper.findByRole('tab', { name: 'Boclips featured' }),
    );
    expect(await wrapper.findByText('Boclips loves pears')).toBeVisible();
  });

  describe('share playlists', () => {
    it('has a share button that copies playlist link to clipboard only for LIBRARY', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      });

      vi.spyOn(navigator.clipboard, 'writeText');

      const client = new FakeBoclipsClient();
      insertUser(client, Product.LIBRARY);

      const playlists = [
        CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
        CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
      ];

      playlists.forEach((it) => client.collections.addToFake(it));

      const wrapper = renderPlaylistsView(client);

      const shareButton = await wrapper.findByTestId(`share-playlist-button-1`);

      await userEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${Constants.HOST}/playlists/1`,
      );
    });

    it('does not have a share button for Classroom', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client, Product.CLASSROOM);

      const playlists = [
        CollectionFactory.sample({ id: '1', title: 'Playlist 1' }),
        CollectionFactory.sample({ id: '2', title: 'Playlist 2' }),
      ];

      playlists.forEach((it) => client.collections.addToFake(it));

      const wrapper = renderPlaylistsView(client);

      expect(wrapper.queryByTestId(`share-playlist-button-1`)).toBeNull();
    });
  });

  describe('Thumbnails', () => {
    it('displays first 3 thumbnails', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);

      const assets = [
        createAssetWithThumbnail('1'),
        createAssetWithThumbnail('2'),
        createAssetWithThumbnail('3'),
        createAssetWithThumbnail('4'),
      ];

      const playlist = CollectionFactory.sample({
        id: '1',
        title: 'My collection about cats',
        assets,
      });

      client.collections.addToFake(playlist);
      assets.forEach((it) => client.videos.insertVideo(it.video));

      const wrapper = renderPlaylistsView(client);

      expect(
        await wrapper.findByText('My collection about cats'),
      ).toBeVisible();
      expect(
        await wrapper.findByLabelText('Thumbnail of Title 1'),
      ).toBeVisible();
      expect(wrapper.getByLabelText('Thumbnail of Title 2')).toBeVisible();
      expect(wrapper.getByLabelText('Thumbnail of Title 3')).toBeVisible();
      expect(wrapper.queryByLabelText('Thumbnail of Title 4')).toBeNull();
    });

    it('displays default thumbnail if there is less than 3 videos in a playlist', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);

      const assets = [
        createAssetWithThumbnail('1'),
        createAssetWithThumbnail('2'),
      ];

      const playlist = CollectionFactory.sample({
        id: '1',
        title: 'My collection about cats',
        assets,
      });

      client.collections.addToFake(playlist);
      assets.forEach((it) => client.videos.insertVideo(it.video));

      const wrapper = renderPlaylistsView(client);

      expect(
        await wrapper.findByText('My collection about cats'),
      ).toBeVisible();
      expect(
        await wrapper.findByLabelText('Thumbnail of Title 1'),
      ).toBeVisible();
      expect(wrapper.getByTestId('default-thumbnail-2')).toBeVisible();
    });

    const createAssetWithThumbnail = (id: string) => {
      const video = VideoFactory.sample({
        id,
        title: `Title ${id}`,
        playback: PlaybackFactory.sample({
          links: {
            thumbnail: new Link({ href: 'http://thumbnail.jpg' }),
            createPlayerInteractedWithEvent: new Link({ href: 'todo' }),
          },
        }),
      });
      return CollectionAssetFactory.sample({ id, video });
    };
  });

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

      const createPlaylistButton = await wrapper.findAllByRole('button', {
        name: 'Create new playlist',
      });

      expect(wrapper.queryByLabelText('Create new playlist')).toBeNull();

      await userEvent.click(createPlaylistButton[0]);

      expect(wrapper.getByLabelText('Create new playlist')).toBeVisible();
      expect(wrapper.getByLabelText('Playlist name')).toBeVisible();
      expect(wrapper.getByLabelText('Playlist name')).toHaveFocus();
      expect(wrapper.getByPlaceholderText('Add name')).toBeVisible();
      expect(wrapper.getByLabelText('Description (Optional)')).toBeVisible();
      expect(wrapper.getByPlaceholderText('Add description')).toBeVisible();
      expect(wrapper.getByRole('button', { name: 'Cancel' })).toBeVisible();
      expect(
        wrapper.getAllByRole('button', { name: 'Create new playlist' })[0],
      ).toBeVisible();
      expect(
        wrapper.getAllByRole('button', { name: 'Create new playlist' })[1],
      ).toBeVisible();
    });

    it('can cancel modal', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      await userEvent.click(wrapper.getByRole('button', { name: 'Cancel' }));

      const modal = wrapper.queryByLabelText('Create new playlist');
      expect(modal).not.toBeInTheDocument();
    });

    it('cannot create a playlist without a title', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create playlist' }),
      );
      const modal = wrapper.queryByLabelText('Create new playlist');
      expect(modal).toBeVisible();
      expect(wrapper.getByText('Playlist name is required')).toBeVisible();
    });

    it('can create a playlist with title and description', async () => {
      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      await userEvent.type(
        wrapper.getByPlaceholderText('Add name'),
        'new playlist name',
      );

      await userEvent.type(
        wrapper.getByPlaceholderText('Add description'),
        'Blabla new playlist',
      );

      await confirmPlaylistCreationModal(wrapper);

      await waitFor(() =>
        expect(wrapper.getByTestId('playlistTitle')).toHaveTextContent(
          'new playlist name',
        ),
      );

      expect(wrapper.getByText('Blabla new playlist')).toBeVisible();
    });

    it('sends playlist created Hotjar event', async () => {
      const hotjarPlaylistCreated = vi.spyOn(
        AnalyticsFactory.hotjar(),
        'event',
      );

      const client = new FakeBoclipsClient();
      insertUser(client);
      const wrapper = renderPlaylistsView(client);

      await openPlaylistCreationModal(wrapper);

      await fillPlaylistName(wrapper, 'My new playlist');
      await fillPlaylistDescription(wrapper, 'Blabla new playlist');
      await confirmPlaylistCreationModal(wrapper);

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
      await confirmPlaylistCreationModal(wrapper);

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
      await confirmPlaylistCreationModal(wrapper);

      await waitFor(() => {
        expect(wrapper.getByTestId('spinner')).toBeInTheDocument();
      });
    });

    const openPlaylistCreationModal = async (wrapper: RenderResult) =>
      userEvent.click(
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

    const confirmPlaylistCreationModal = async (wrapper: RenderResult) =>
      userEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));
  });
});
