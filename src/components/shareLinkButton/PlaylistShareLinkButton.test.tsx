import React from 'react';
import { render, RenderResult, waitFor, within } from '@testing-library/react';
import { PlaylistShareLinkButton } from 'src/components/shareLinkButton/PlaylistShareLinkButton';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import userEvent from '@testing-library/user-event';
import { getShareablePlaylistLink } from 'src/components/shareLinkButton/getShareableLink';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { lastEvent } from 'src/testSupport/lastEvent';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe('playlist share link button', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it(`renders label when iconOnly false`, async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <PlaylistShareLinkButton playlist={CollectionFactory.sample({})} />
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
          <PlaylistShareLinkButton
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
        'Students only need the link to access and play video(s).',
      ),
    ).toBeVisible();
  });

  it(`copies share link but doesn't close modal on clicking main button`, async () => {
    const apiClient = new FakeBoclipsClient();
    jest.spyOn(navigator.clipboard, 'writeText');
    const trackCollectionShareCodeSpy = jest.spyOn(
      apiClient.shareCodes,
      'trackCollectionShareCode',
    );
    // @ts-ignore
    apiClient.shareCodes.trackCollectionShareCode = trackCollectionShareCodeSpy;
    const wrapper = renderShareButton(apiClient);
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(
      wrapper.getByText('Share this playlist with students'),
    ).toBeVisible();

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Copy link' }),
    );

    expect(trackCollectionShareCodeSpy).toHaveBeenCalledWith('playlist-id');

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
        subtype: 'PLAYLIST_SHARE_LINK_MODAL_OPENED',
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
        subtype: 'PLAYLIST_SHARE_LINK_COPIED',
        anonymous: false,
      });
    });
  });

  const renderShareButton = (apiClient = new FakeBoclipsClient()) => {
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'user-id',
      }),
    );

    return render(
      <main tabIndex={-1}>
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={apiClient}>
              <ToastContainer />
              <PlaylistShareLinkButton
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
