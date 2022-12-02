import { render, RenderResult, within } from '@testing-library/react';
import React from 'react';
import { OptionsButton } from 'src/components/playlists/playlistHeader/OptionsButton';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('OptionsButton', () => {
  describe('Edit', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <OptionsButton playlist={CollectionFactory.sample({ mine: true })} />,
      );

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const wrapper = render(
        <OptionsButton playlist={CollectionFactory.sample({ mine: false })} />,
      );

      const editButton = await getOption(wrapper, 'Edit');
      expect(editButton).toBeUndefined();
    });
  });

  describe('Make a copy', () => {
    it('is available for owners', async () => {
      const wrapper = render(
        <OptionsButton playlist={CollectionFactory.sample({ mine: true })} />,
      );

      const copyButton = await getOption(wrapper, 'Make a copy');
      expect(copyButton).toBeVisible();
    });

    it('is available for non-owners', async () => {
      const wrapper = render(
        <OptionsButton playlist={CollectionFactory.sample({ mine: false })} />,
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
    it('is available for owners', async () => {
      const wrapper = render(
        <OptionsButton playlist={CollectionFactory.sample({ mine: true })} />,
      );

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeVisible();
    });

    it('is not available for non-owners', async () => {
      const wrapper = render(
        <OptionsButton playlist={CollectionFactory.sample({ mine: false })} />,
      );

      const removeButton = await getOption(wrapper, 'Remove');
      expect(removeButton).toBeUndefined();
    });

    it('opens up new modal when clicking on it', async () => {
      const apiClient = new FakeBoclipsClient();
      const removePlaylistSpy = jest
        .spyOn(apiClient.collections, 'delete')
        .mockImplementation(() => Promise.resolve({}));

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
                mine: true,
              })}
            />
          </BoclipsClientProvider>
        </QueryClientProvider>,
      );

      const removeButton = await getOption(wrapper, 'Remove');
      await userEvent.click(removeButton);

      const modal = wrapper.getByRole('dialog');

      expect(modal).toBeVisible();
      expect(within(modal).getByText('Remove playlist')).toBeVisible();
      expect(within(modal).getByText('Original playlist')).toBeVisible();

      await userEvent.click(
        within(modal).getByRole('button', { name: 'Yes, remove it' }),
      );

      expect(removePlaylistSpy).toHaveBeenCalledWith({
        title: 'Original playlist',
        description: 'Description of original playlist',
        videos: [...videos.map((v) => v.id)],
        origin: 'BO_WEB_APP',
      });
    });
  });

  const getOption = async (wrapper: RenderResult, name: string) => {
    await userEvent.click(wrapper.getByRole('button', { name: 'Options' }));
    const options = wrapper.queryAllByRole('menuitem');
    return options?.find((element) => within(element).queryByText(name));
  };
});
