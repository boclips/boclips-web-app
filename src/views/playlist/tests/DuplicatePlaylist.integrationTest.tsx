import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { render, RenderResult, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Duplicate playlist', () => {
  const playlist = CollectionFactory.sample({
    id: 'pl123',
    title: 'Original playlist',
    description: 'Description of original playlist',
    assets: [
      CollectionAssetFactory.sample({
        id: { videoId: 'video1', highlightId: null },
      }),
    ],
    mine: false,
  });

  it('successfully duplicating a playlist will show a toast to the user and save original details to user', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.collections.addToFake(playlist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const myPlaylistsBefore = await apiClient.collections.getMyCollections({});
    await duplicatePlaylist(wrapper);

    expect(
      await wrapper.findByTestId('copy-playlist-success'),
    ).toBeInTheDocument();

    expect(myPlaylistsBefore.page).toHaveLength(0);

    const myPlaylists = await apiClient.collections.getMyCollections({});
    expect(myPlaylists.page).toHaveLength(1);
    expect(myPlaylists.page[0].title).toBe('Copy of Original playlist');
    expect(myPlaylists.page[0].description).toBe(
      'Description of original playlist',
    );
    expect(myPlaylists.page[0].assets[0].id.videoId).toBe('video1');
  });

  it('failure in duplicating playlist will show error details in a toast', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.collections.addToFake(playlist);

    jest
      .spyOn(apiClient.collections, 'create')
      .mockImplementation(() => Promise.reject());

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/pl123']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await duplicatePlaylist(wrapper);

    expect(
      await wrapper.findByTestId('copy-playlist-failed'),
    ).toBeInTheDocument();
  });

  const duplicatePlaylist = async (wrapper: RenderResult) => {
    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Options' }),
    );
    const options = wrapper.queryAllByRole('menuitem');
    const copyButton = options?.find((element) =>
      within(element).queryByText('Make a copy'),
    );

    await userEvent.click(copyButton);
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );
  };
});
