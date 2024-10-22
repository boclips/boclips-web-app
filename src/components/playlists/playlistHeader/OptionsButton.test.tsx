import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import { OptionsButton } from 'src/components/playlists/playlistHeader/OptionsButton';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { MemoryRouter } from 'react-router-dom';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { lastEvent } from 'src/testSupport/lastEvent';

describe('OptionsButton', () => {
  it('emits event when Options button is clicked', async () => {
    const client = new FakeBoclipsClient();
    const playlist = CollectionFactory.sample({ mine: true });

    const wrapper = renderOptionsButton(playlist, client);

    fireEvent.click(wrapper.getByRole('button', { name: 'Options' }));

    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'PLAYLIST_OPTIONS_BUTTON_CLICKED',
        anonymous: false,
      });
    });
  });

  describe('Edit', () => {
    it('is available for owners', async () => {
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist);

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const playlist = CollectionFactory.sample({ mine: false });
      const wrapper = renderOptionsButton(playlist);

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeUndefined();
    });

    it('emits event when Edit button is clicked', async () => {
      const client = new FakeBoclipsClient();
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, client);

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeVisible();

      fireEvent.click(editButton);

      await waitFor(() => {
        expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'PLAYLIST_EDIT_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });
  });

  describe('Unfollow', () => {
    it('is not available for owners', async () => {
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist);

      const editButton = await getOption(wrapper, 'Unfollow');
      expect(editButton).toBeUndefined();
    });

    it('is available for non-owners', async () => {
      const playlist = CollectionFactory.sample({ mine: false });
      const wrapper = renderOptionsButton(playlist);

      const editButton = await getOption(wrapper, 'Unfollow');
      expect(editButton).toBeVisible();
    });
  });

  describe('Reorder', () => {
    it('should display reorder button', async () => {
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist);

      const reorder = await getOption(wrapper, 'Reorder videos');
      expect(reorder).toBeVisible();
    });

    it('should display modal when reorder button clicked', async () => {
      const playlist = CollectionFactory.sample({
        title: 'Example playlist',
        mine: true,
      });
      const wrapper = renderOptionsButton(playlist);

      const reorder = await getOption(wrapper, 'Reorder videos');
      await userEvent.click(reorder);

      const modal = wrapper.getByRole('dialog');

      expect(modal).toBeVisible();
      expect(within(modal).getByText('Reorder videos')).toBeVisible();
    });

    it('emits event when Reorder button is clicked', async () => {
      const client = new FakeBoclipsClient();
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, client);

      const reorderButton = await getOption(wrapper, 'Reorder videos');
      expect(reorderButton).toBeVisible();

      fireEvent.click(reorderButton);

      await waitFor(() => {
        expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'PLAYLIST_REORDER_VIDEOS_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });
  });

  describe('Make a copy', () => {
    it('is available for owners', async () => {
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist);

      const copyButton = await getOption(wrapper, 'Make a copy');
      expect(copyButton).toBeVisible();
    });

    it('is available for non-owners', async () => {
      const playlist = CollectionFactory.sample({ mine: false });
      const wrapper = renderOptionsButton(playlist);

      const copyButton = await getOption(wrapper, 'Make a copy');
      expect(copyButton).toBeVisible();
    });

    it('opens up new modal when clicking on it', async () => {
      const apiClient = new FakeBoclipsClient();
      const copyPlaylistSpy = jest
        .spyOn(apiClient.collections, 'create')
        .mockImplementation(() => Promise.resolve('playlist-id'));

      const assets = [
        CollectionAssetFactory.sample({
          id: 'video1',
          video: VideoFactory.sample({ id: 'video1' }),
        }),
        CollectionAssetFactory.sample({
          id: 'video2',
          video: VideoFactory.sample({ id: 'video2' }),
        }),
        CollectionAssetFactory.sample({
          id: 'video3',
          video: VideoFactory.sample({ id: 'video3' }),
        }),
      ];

      const playlist = CollectionFactory.sample({
        title: 'Original playlist',
        description: 'Description of original playlist',
        assets,
        mine: false,
      });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const copyButton = await getOption(wrapper, 'Make a copy');
      await userEvent.click(copyButton);

      const modal = wrapper.getByRole('dialog');

      expect(modal).toBeVisible();
      expect(within(modal).getByText('Make a copy')).toBeVisible();
      expect(within(modal).getByLabelText('Playlist name')).toBeVisible();
      expect(
        within(modal).getByLabelText('Description (Optional)'),
      ).toBeVisible();

      await userEvent.click(
        within(modal).getByRole('button', { name: 'Create playlist' }),
      );

      expect(copyPlaylistSpy).toHaveBeenCalledWith({
        title: 'Copy of Original playlist',
        description: 'Description of original playlist',
        videos: [...assets.map((v) => v.id)],
      });
    });

    it('emits event when Make a Copy button is clicked', async () => {
      const client = new FakeBoclipsClient();
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, client);

      const makeCopyButton = await getOption(wrapper, 'Make a copy');
      expect(makeCopyButton).toBeVisible();

      fireEvent.click(makeCopyButton);

      await waitFor(() => {
        expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'PLAYLIST_MAKE_COPY_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });
  });

  describe('Remove', () => {
    const apiClient = new FakeBoclipsClient();
    it('is available for owners', async () => {
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const playlist = CollectionFactory.sample({ mine: false });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeUndefined();
    });
  });

  describe('Share with teachers', () => {
    const apiClient = new FakeBoclipsClient();
    const classroomUser = UserFactory.sample({
      account: {
        id: 'acc-1',
        name: 'Crazy Account',
        products: [Product.CLASSROOM],
        createdAt: new Date(),
        type: AccountType.STANDARD,
      },
    });

    it('is available for Classroom users for their own playlist', async () => {
      apiClient.users.insertCurrentUser(classroomUser);

      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeVisible();
    });

    it('is not available for Classroom users if they are not owner', async () => {
      apiClient.users.insertCurrentUser(classroomUser);

      const playlist = CollectionFactory.sample({ mine: false });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeUndefined();
    });

    it('should display modal when share button is clicked', async () => {
      apiClient.users.insertCurrentUser(classroomUser);

      const playlist = CollectionFactory.sample({
        title: 'Example playlist',
        mine: true,
      });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      await userEvent.click(shareWithTeachersButton);

      const modal = wrapper.getByRole('dialog');

      expect(modal).toBeVisible();
      expect(
        within(modal).getByText('Share this playlist with other teachers'),
      ).toBeVisible();
    });

    it('is not available for LIBRARY users', async () => {
      apiClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            id: 'acc-1',
            name: 'Crazy Account',
            products: [Product.LIBRARY],
            createdAt: new Date(),
            type: AccountType.STANDARD,
          },
        }),
      );
      const playlist = CollectionFactory.sample({ mine: false });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeUndefined();
    });

    it('emits event when Share with Teachers button is clicked', async () => {
      apiClient.users.insertCurrentUser(classroomUser);

      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeVisible();

      fireEvent.click(shareWithTeachersButton);

      await waitFor(() => {
        expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'PLAYLIST_SHARE_WITH_TEACHERS_BUTTON_CLICKED',
          anonymous: false,
        });
      });
    });

    it('emits event when share link link is copied', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      });

      apiClient.users.insertCurrentUser(classroomUser);

      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist, apiClient);

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeVisible();
      fireEvent.click(shareWithTeachersButton);

      expect(wrapper.getByRole('dialog')).toBeVisible();

      const copyLinkButton = wrapper.getByRole('button', { name: 'Copy link' });
      expect(copyLinkButton).toBeVisible();
      fireEvent.click(copyLinkButton);

      await waitFor(() => {
        expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
          type: 'PLATFORM_INTERACTED_WITH',
          subtype: 'PLAYLIST_SHARE_TEACHERS_CODE_COPIED',
          anonymous: false,
        });
      });
    });
  });

  describe('Add videos', () => {
    it('is available for owners', async () => {
      const playlist = CollectionFactory.sample({ mine: true });
      const wrapper = renderOptionsButton(playlist);

      const addVideosButton = await getOption(wrapper, 'Add videos');
      expect(addVideosButton).toBeVisible();
    });

    it('is available for non-owners when editing is enabled', async () => {
      const playlist = CollectionFactory.sample({
        mine: false,
        permissions: { anyone: CollectionPermission.EDIT },
      });

      const wrapper = renderOptionsButton(playlist);

      const addVideosButton = await getOption(wrapper, 'Add videos');
      expect(addVideosButton).toBeVisible();
    });

    it('is not available for non-owners when editing is not enabled', async () => {
      const playlist = CollectionFactory.sample({
        mine: false,
        permissions: { anyone: CollectionPermission.VIEW_ONLY },
      });

      const wrapper = renderOptionsButton(playlist);

      const addVideosButton = await getOption(wrapper, 'Add videos');
      expect(addVideosButton).toBeUndefined();
    });
  });

  const getOption = async (wrapper: RenderResult, name: string) => {
    await userEvent.click(wrapper.getByRole('button', { name: 'Options' }));
    const options = wrapper.queryAllByRole('menuitem');
    return options?.find((element) => within(element).queryByText(name));
  };

  const renderOptionsButton = (
    playlist: Collection,
    client = new FakeBoclipsClient(),
  ) => {
    return render(
      <MemoryRouter>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <OptionsButton playlist={playlist} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );
  };
});
