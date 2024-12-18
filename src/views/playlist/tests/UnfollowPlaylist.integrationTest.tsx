import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { render, RenderResult, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@src/App';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Unfollow playlist', () => {
  const playlist = CollectionFactory.sample({
    id: 'pl123',
    title: 'Original playlist',
    description: 'Description of original playlist',
    assets: [
      CollectionAssetFactory.sample({
        id: 'video1',
        video: VideoFactory.sample({ id: 'video1' }),
      }),
    ],
    mine: false,
    owner: 'itsmeluigi',
  });

  it.skip('successfully unfollowing a playlist will redirect to playlists page', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.collections.setCurrentUser('itsmemario');
    apiClient.collections.addToFake(playlist);
    await apiClient.collections.bookmark(playlist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const myPlaylistsBefore = await apiClient.collections.getMySavedCollections(
      {},
    );
    expect(myPlaylistsBefore.page).toHaveLength(1);

    await unfollowPlaylist(wrapper);

    expect(await wrapper.getByText('Playlists')).toBeVisible();

    const myPlaylists = await apiClient.collections.getMySavedCollections({});
    expect(myPlaylists.page).toHaveLength(0);

    apiClient.collections.clear();
  });

  it.skip('failure when unfollowing playlist will show error details in a toast', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.collections.addToFake(playlist);

    vi.spyOn(apiClient.collections, 'unbookmark').mockImplementation(() =>
      Promise.reject(),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await unfollowPlaylist(wrapper);

    expect(
      await wrapper.findByTestId('unfollow-playlist-failed'),
    ).toBeInTheDocument();
  });

  const unfollowPlaylist = async (wrapper: RenderResult) => {
    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Options' }),
    );
    const options = wrapper.queryAllByRole('menuitem');
    const unfollowButton = options?.find((element) =>
      within(element).queryByText('Unfollow'),
    );

    await userEvent.click(unfollowButton);
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Yes, unfollow' }),
    );
  };
});
