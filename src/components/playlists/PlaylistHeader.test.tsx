import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import PlaylistHeader from 'src/components/playlists/PlaylistHeader';
import { Constants } from 'src/AppConstants';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import HotjarFactory from 'src/services/hotjar/HotjarFactory';
import { HotjarEvents } from 'src/services/hotjar/Events';

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

    const wrapper = render(<PlaylistHeader playlist={playlist} />);

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

    const wrapper = render(<PlaylistHeader playlist={playlist} />);

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
      <>
        <ToastContainer />
        <PlaylistHeader playlist={playlist} />
      </>,
    );

    const shareButton = await wrapper.findByTestId('share-playlist-button');

    fireEvent.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${Constants.HOST}/playlists/123`,
    );

    const notification = await wrapper.findByTestId(
      'playlist-link-copied-notification',
    );
    expect(notification).toBeVisible();
    expect(notification.children.item(0).textContent).toEqual('Link copied!');
    expect(notification.children.item(1).textContent).toEqual(
      'You can now share this playlist using the copied link',
    );
  });

  it('sends Hotjar link copied event', async () => {
    const hotjarEventSent = jest.spyOn(HotjarFactory.hotjar(), 'event');

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = render(
      <>
        <ToastContainer />
        <PlaylistHeader playlist={playlist} />
      </>,
    );

    const shareButton = await wrapper.findByTestId('share-playlist-button');

    fireEvent.click(shareButton);

    await waitFor(() =>
      expect(hotjarEventSent).toHaveBeenCalledWith(
        HotjarEvents.PlaylistShareableLinkCopied,
      ),
    );
  });
});
