import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render, RenderResult, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Remove playlist', () => {
  const playlist = CollectionFactory.sample({
    id: 'pl123',
    title: 'Original playlist',
    description: 'Description of original playlist',
    videos: [VideoFactory.sample({ id: 'video1' })],
    mine: true,
    owner: 'itsmemario',
  });

  it('successfully removing a playlist will redirect to playlists page', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.collections.setCurrentUser('itsmemario');
    apiClient.collections.addToFake(playlist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const myPlaylistsBefore = await apiClient.collections.getMyCollections({});
    expect(myPlaylistsBefore.page).toHaveLength(1);

    await removePlaylist(wrapper);

    expect(window.location.pathname).toBe('/playlists');

    const myPlaylists = await apiClient.collections.getMyCollections({});
    expect(myPlaylists.page).toHaveLength(0);

    apiClient.collections.clear();
  });

  it('failure in removing playlist will show error details in a toast', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.collections.addToFake(playlist);

    jest
      .spyOn(apiClient.collections, 'delete')
      .mockImplementation(() => Promise.reject());

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await removePlaylist(wrapper);

    expect(
      await wrapper.findByTestId('remove-playlist-failed'),
    ).toBeInTheDocument();
  });

  const removePlaylist = async (wrapper: RenderResult) => {
    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Options' }),
    );
    const options = wrapper.queryAllByRole('menuitem');
    const removeButton = options?.find((element) =>
      within(element).queryByText('Remove'),
    );

    await userEvent.click(removeButton);
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Yes, remove it' }),
    );
  };
});
