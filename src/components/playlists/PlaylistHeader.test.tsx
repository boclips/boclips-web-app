import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import PlaylistHeader from 'src/components/playlists/PlaylistHeader';
import { Constants } from 'src/AppConstants';

describe('Playlist Header', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  Object.assign(window, {
    location: 'blah',
  });

  it('has visible playlist title', async () => {
    const title = 'test playlist';

    const wrapper = render(<PlaylistHeader title={title} playlistId="" />);

    const titleElement = await wrapper.findByTestId('playlistTitle');

    expect(titleElement).toBeVisible();
    expect(titleElement.innerHTML).toBe(title);
  });

  it('has a share button', async () => {
    const wrapper = render(
      <PlaylistHeader title="Playlist title" playlistId="" />,
    );

    const shareButton = await wrapper.findByRole('button', {
      name: 'Get shareable link',
    });

    expect(shareButton).toBeVisible();
  });

  it('copies the playlist link on the playlist page', async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const wrapper = render(
      <PlaylistHeader title="Playlist title" playlistId="123" />,
    );

    const shareButton = await wrapper.findByRole('button', {
      name: 'Get shareable link',
    });

    fireEvent.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${Constants.HOST}/library/123`,
    );
  });
});
