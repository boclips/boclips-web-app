import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PlaylistShareCodeButton } from 'src/components/playlists/buttons/PlaylistShareCodeButton';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import userEvent from '@testing-library/user-event';
import { getShareablePlaylistLink } from 'src/components/videoShareButton/getShareableLink';
import { ToastContainer } from 'react-toastify';

describe('PlaylistShareCodeButton', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('displays playlist share code modal on click', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(UserFactory.sample({ shareCode: '123' }));

    render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={new QueryClient()}>
          <PlaylistShareCodeButton
            playlist={{ id: 'playlist-id', title: 'My Playlist' }}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Share this playlist with students')).toBeVisible();
    expect(
      screen.getByText(
        'My Playlist will be shared with the time bookmarks you currently have set.',
      ),
    ).toBeVisible();

    expect(
      screen.getByText(
        'Students need both the link and your unique teacher code to access and play video(s).',
      ),
    ).toBeVisible();

    const footer = await screen.findByTestId('share-code-footer');
    expect(footer).toBeVisible();
    expect(footer.textContent).toEqual('Your unique Teacher code is 123');
  });

  it(`copies share link but doesn't close modal on clicking main button`, async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({ id: 'user-id', shareCode: '123' }),
    );

    render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={new QueryClient()}>
          <ToastContainer />
          <PlaylistShareCodeButton
            playlist={{ id: 'playlist-id', title: 'My Playlist' }}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Share this playlist with students')).toBeVisible();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Copy link' }),
    );

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      getShareablePlaylistLink('playlist-id', 'user-id'),
    );

    const notification = await screen.findByRole('alert');
    expect(within(notification).getByText('Share link copied!')).toBeVisible();

    expect(
      await screen.findByText('Share this playlist with students'),
    ).toBeVisible();
  });

  it(`includes a link to google classroom`, async () => {
    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <ToastContainer />
          <PlaylistShareCodeButton
            playlist={{ id: 'playlist-id', title: 'My Playlist' }}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    expect(
      await screen.findByRole('link', {
        name: 'Share to Google Classroom',
      }),
    ).toBeVisible();
  });
});
