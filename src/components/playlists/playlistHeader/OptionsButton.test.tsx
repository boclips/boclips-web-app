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

describe('OptionsButton', () => {
  describe('Edit', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: true })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: false })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeUndefined();
    });
  });

  describe('Reorder', () => {
    it('should display rearrange button', async () => {
      const client = new FakeBoclipsClient();
      client.users.insertCurrentUser(
        UserFactory.sample({
          features: {
            BO_WEB_APP_REORDER_VIDEOS_IN_PLAYLIST: true,
          },
        }),
      );

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: true })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      const rearrange = await getOption(wrapper, 'Rearrange');
      expect(rearrange).toBeVisible();
    });

    it('should display modal when rearrange button clicked', async () => {
      const client = new FakeBoclipsClient();
      client.users.insertCurrentUser(
        UserFactory.sample({
          features: {
            BO_WEB_APP_REORDER_VIDEOS_IN_PLAYLIST: true,
          },
        }),
      );

      const wrapper = render(
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={client}>
            <OptionsButton
              playlist={CollectionFactory.sample({
                title: 'Example playlist',
                mine: true,
              })}
            />
          </BoclipsClientProvider>
        </QueryClientProvider>,
      );

      const rearrange = await getOption(wrapper, 'Rearrange');
      await userEvent.click(rearrange);

      const modal = wrapper.getByRole('dialog');

      expect(modal).toBeVisible();
      expect(within(modal).getByText('Rearrange videos')).toBeVisible();
    });
  });

  describe('Make a copy', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: true })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      const copyButton = await getOption(wrapper, 'Make a copy');
      expect(copyButton).toBeVisible();
    });

    it('is available for non-owners', async () => {
      const wrapper = render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: false })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>,
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
        </QueryClientProvider>,
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
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={apiClient}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: true })}
            />
          </BoclipsClientProvider>
        </QueryClientProvider>,
      );

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const wrapper = render(
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={apiClient}>
            <OptionsButton
              playlist={CollectionFactory.sample({ mine: false })}
            />
          </BoclipsClientProvider>
        </QueryClientProvider>,
      );

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeUndefined();
    });
  });

  const getOption = async (wrapper: RenderResult, name: string) => {
    await userEvent.click(wrapper.getByRole('button', { name: 'Options' }));
    const options = wrapper.queryAllByRole('menuitem');
    return options?.find((element) => within(element).queryByText(name));
  };
});
