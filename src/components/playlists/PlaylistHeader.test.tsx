import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import PlaylistHeader from 'src/components/playlists/PlaylistHeader';
import { Constants } from 'src/AppConstants';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { MemoryRouter } from 'react-router-dom';

describe('Playlist Header', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('has visible playlist title', async () => {
    const title = 'test playlist';
    const playlist = CollectionFactory.sample({
      id: '123',
      title,
      description: 'Description',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    const titleElement = await wrapper.findByTestId('playlistTitle');

    expect(titleElement).toBeVisible();
    expect(titleElement.innerHTML).toBe(title);
  });

  it('has a share button', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    const shareButton = await wrapper.findByTestId('share-playlist-button');

    expect(shareButton).toBeVisible();
  });

  it('copies the playlist link on the playlist page and shows notification', async () => {
    jest.spyOn(navigator.clipboard, 'writeText');
    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = render(
      <MemoryRouter>
        <ToastContainer />
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    const shareButton = await wrapper.findByTestId('share-playlist-button');

    fireEvent.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${Constants.HOST}/playlists/123`,
    );

    await waitFor(() =>
      wrapper.getByTestId('playlist-link-copied-notification'),
    ).then((it) => {
      expect(it).toBeVisible();
    });

    expect(wrapper.getByText('Link copied!')).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'You can now share this playlist using the copied link',
      ),
    ).toBeInTheDocument();
  });

  it('sends Hotjar link copied event', async () => {
    const hotjarEventSent = jest.spyOn(AnalyticsFactory.hotjar(), 'event');

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = render(
      <MemoryRouter>
        <ToastContainer />
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    const shareButton = await wrapper.findByTestId('share-playlist-button');

    fireEvent.click(shareButton);

    await waitFor(() =>
      expect(hotjarEventSent).toHaveBeenCalledWith(
        HotjarEvents.PlaylistShareableLinkCopied,
      ),
    );
  });

  it('has an edit button', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    const editButton = await wrapper.findByText('Edit playlist');

    expect(editButton).toBeVisible();
  });
});
