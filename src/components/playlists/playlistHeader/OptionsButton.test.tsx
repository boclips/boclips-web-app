import { render, RenderResult, within } from '@testing-library/react';
import React from 'react';
import { OptionsButton } from 'src/components/playlists/playlistHeader/OptionsButton';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { MemoryRouter } from 'react-router-dom';

describe('OptionsButton', () => {
  describe('Edit', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: false })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeUndefined();
    });
  });

  describe('Unfollow', () => {
    it('is not available for owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const editButton = await getOption(wrapper, 'Unfollow');
      expect(editButton).toBeUndefined();
    });

    it('is available for non-owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: false })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const editButton = await getOption(wrapper, 'Unfollow');
      expect(editButton).toBeVisible();
    });
  });

  describe('Reorder', () => {
    it('should display reorder button', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const reorder = await getOption(wrapper, 'Reorder videos');
      expect(reorder).toBeVisible();
    });

    it('should display modal when reorder button clicked', async () => {
      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={new FakeBoclipsClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({
                  title: 'Example playlist',
                  mine: true,
                })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

      const reorder = await getOption(wrapper, 'Reorder videos');
      await userEvent.click(reorder);

      const modal = wrapper.getByRole('dialog');

      expect(modal).toBeVisible();
      expect(within(modal).getByText('Reorder videos')).toBeVisible();
    });
  });

  describe('Make a copy', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const copyButton = await getOption(wrapper, 'Make a copy');
      expect(copyButton).toBeVisible();
    });

    it('is available for non-owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: false })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const copyButton = await getOption(wrapper, 'Make a copy');
      expect(copyButton).toBeVisible();
    });

    it('opens up new modal when clicking on it', async () => {
      const apiClient = new FakeBoclipsClient();
      const copyPlaylistSpy = jest
        .spyOn(apiClient.collections, 'create')
        .mockImplementation(() => Promise.resolve('playlist-id'));

      const videos = [
        VideoFactory.sample({ id: 'video1' }),
        VideoFactory.sample({ id: 'video2' }),
        VideoFactory.sample({ id: 'video3' }),
      ];

      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({
                  title: 'Original playlist',
                  description: 'Description of original playlist',
                  videos,
                  mine: false,
                })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

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
        videos: [...videos.map((v) => v.id)],
        origin: 'BO_WEB_APP',
      });
    });
  });

  describe('Remove', () => {
    const apiClient = new FakeBoclipsClient();
    it('is available for owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: false })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

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

      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeVisible();
    });

    it('is not available for Classroom users if they are not owner', async () => {
      apiClient.users.insertCurrentUser(classroomUser);

      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: false })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeUndefined();
    });

    it('should display modal when share button is clicked', async () => {
      apiClient.users.insertCurrentUser(classroomUser);

      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({
                  title: 'Example playlist',
                  mine: true,
                })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

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

    it('is not available for B2B users', async () => {
      apiClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            id: 'acc-1',
            name: 'Crazy Account',
            products: [Product.B2B],
            createdAt: new Date(),
            type: AccountType.STANDARD,
          },
        }),
      );
      const wrapper = render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: false })}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );

      const shareWithTeachersButton = await getOption(
        wrapper,
        'Share with teachers',
      );
      expect(shareWithTeachersButton).toBeUndefined();
    });
  });

  describe('Add videos', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({ mine: true })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const addVideosButton = await getOption(wrapper, 'Add videos');
      expect(addVideosButton).toBeVisible();
    });

    it('is available for non-owners when editing is enabled', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({
                  mine: false,
                  permissions: { anyone: CollectionPermission.EDIT },
                })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const addVideosButton = await getOption(wrapper, 'Add videos');
      expect(addVideosButton).toBeVisible();
    });

    it('is not available for non-owners when editing is not enabled', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <OptionsButton
                playlist={CollectionFactory.sample({
                  mine: false,
                  permissions: { anyone: CollectionPermission.VIEW_ONLY },
                })}
              />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const addVideosButton = await getOption(wrapper, 'Add videos');
      expect(addVideosButton).toBeUndefined();
    });
  });

  const getOption = async (wrapper: RenderResult, name: string) => {
    await userEvent.click(wrapper.getByRole('button', { name: 'Options' }));
    const options = wrapper.queryAllByRole('menuitem');
    return options?.find((element) => within(element).queryByText(name));
  };
});
