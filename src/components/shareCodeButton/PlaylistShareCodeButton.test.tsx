import React from 'react';
import { render, RenderResult, waitFor, within } from '@testing-library/react';
import { PlaylistShareCodeButton } from 'src/components/shareCodeButton/PlaylistShareCodeButton';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import userEvent from '@testing-library/user-event';
import { getShareablePlaylistLink } from 'src/components/shareCodeButton/getShareableLink';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { lastEvent } from 'src/testSupport/lastEvent';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe('playlist share code button', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it(`renders label when iconOnly false`, async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <PlaylistShareCodeButton playlist={CollectionFactory.sample({})} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(await wrapper.findByText('Share')).toBeVisible();
  });

  it(`doesn't render label when iconOnly`, async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <PlaylistShareCodeButton
            iconOnly
            playlist={CollectionFactory.sample({})}
          />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(wrapper.queryByText('Share')).toBeNull();
  });

  it('displays playlist share code modal on click', async () => {
    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(
      wrapper.getByText('Share this playlist with students'),
    ).toBeVisible();
    expect(
      wrapper.getByText(
        'My Playlist will be shared with the time bookmarks you currently have set.',
      ),
    ).toBeVisible();

    expect(
      wrapper.getByText(
        'Students need both the link and your unique access code to access and play video(s).',
      ),
    ).toBeVisible();

    const footer = await wrapper.findByTestId('share-code-footer');
    expect(footer).toBeVisible();
    expect(footer.textContent).toEqual('Your unique access code is 1739');
  });

  it(`copies share link but doesn't close modal on clicking main button`, async () => {
    jest.spyOn(navigator.clipboard, 'writeText');

    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(
      wrapper.getByText('Share this playlist with students'),
    ).toBeVisible();

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Copy link' }),
    );

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      getShareablePlaylistLink('playlist-id', 'user-id'),
    );

    const notification = await wrapper.findByRole('alert');
    expect(within(notification).getByText('Share link copied!')).toBeVisible();

    expect(
      await wrapper.findByText('Share this playlist with students'),
    ).toBeVisible();
  });

  it(`includes a link to google classroom`, async () => {
    const wrapper = renderShareButton();
    await openShareModal(wrapper);

    expect(
      await wrapper.findByRole('link', {
        name: 'Share to Google Classroom',
      }),
    ).toBeVisible();
  });

  it('removes the tabIndex on main element, to allow copying the text', async () => {
    const wrapper = renderShareButton();

    expect(wrapper.getByRole('main')).toHaveAttribute('tabIndex', '-1');

    await openShareModal(wrapper);

    await waitFor(() =>
      expect(wrapper.getByRole('main')).not.toHaveAttribute('tabIndex'),
    );
  });

  it('emits events when share code modal opened', async () => {
    const client = new FakeBoclipsClient();
    const wrapper = renderShareButton(client);
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(
      wrapper.getByText('Share this playlist with students'),
    ).toBeVisible();

    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'PLAYLIST_SHARE_CODE_MODAL_OPENED',
        anonymous: false,
      });
    });
  });

  it('emits events when share code link is copied', async () => {
    const client = new FakeBoclipsClient();
    const wrapper = renderShareButton(client);
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(
      wrapper.getByText('Share this playlist with students'),
    ).toBeVisible();

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Copy link' }),
    );

    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'PLAYLIST_SHARE_CODE_LINK_COPIED',
        anonymous: false,
      });
    });
  });

  const renderShareButton = (apiClient = new FakeBoclipsClient()) => {
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'user-id',
        shareCode: '1739',
      }),
    );

    return render(
      <main tabIndex={-1}>
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <ToastContainer />
              <PlaylistShareCodeButton
                iconOnly
                playlist={{ id: 'playlist-id', title: 'My Playlist' }}
              />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </BoclipsSecurityProvider>
      </main>,
    );
  };

  const openShareModal = async (wrapper: RenderResult) => {
    const button = await wrapper.findByRole('button', { name: 'Share' });
    await userEvent.click(button);
  };
});
