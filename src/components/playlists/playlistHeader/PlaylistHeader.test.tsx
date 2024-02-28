import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import PlaylistHeader from 'src/components/playlists/playlistHeader/PlaylistHeader';
import { Constants } from 'src/AppConstants';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

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

  it('has visible You when current user is playlist owner', async () => {
    const title = 'test playlist';
    const playlist = CollectionFactory.sample({
      id: '123',
      title,
      description: 'Description',
      mine: true,
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('By: You')).toBeVisible();
  });

  it('has visible playlist owner name', async () => {
    const title = 'test playlist';
    const playlist = CollectionFactory.sample({
      id: '123',
      title,
      description: 'Description',
      mine: false,
      ownerName: 'The Owner',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('By: The Owner')).toBeVisible();
  });

  describe('share button for B2B', () => {
    it('view-only playlist has a view-only share button for non-owner', async () => {
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
        permissions: { anyone: CollectionPermission.VIEW_ONLY },
      });

      const wrapper = render(
        <MemoryRouter>
          <PlaylistHeader playlist={playlist} />
        </MemoryRouter>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'Get view-only link' }),
      ).toBeVisible();
    });

    it('editable playlist has a share button for non-owner', async () => {
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
        permissions: { anyone: CollectionPermission.EDIT },
      });

      const wrapper = render(
        <MemoryRouter>
          <PlaylistHeader playlist={playlist} />
        </MemoryRouter>,
      );

      expect(
        await wrapper.findByRole('button', { name: 'Share' }),
      ).toBeVisible();
    });

    it('copies the playlist link on the playlist page and shows notification', async () => {
      jest.spyOn(navigator.clipboard, 'writeText');
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
      });

      const wrapper = render(
        <MemoryRouter>
          <ToastContainer />
          <PlaylistHeader playlist={playlist} />
        </MemoryRouter>,
      );

      const shareButton = await wrapper.findByRole('button', {
        name: 'Get view-only link',
      });

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
  });

  describe('share button for Classroom', () => {
    it('does not show share button', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
          },
        }),
      );
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
        permissions: { anyone: CollectionPermission.VIEW_ONLY },
      });

      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={fakeClient}>
            <QueryClientProvider client={new QueryClient()}>
              <PlaylistHeader playlist={playlist} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      expect(
        wrapper.queryByRole('button', { name: 'Get view-only link' }),
      ).toBeNull();
    });

    it('editable playlist has a share button for non-owner', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
          },
        }),
      );

      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
        permissions: { anyone: CollectionPermission.EDIT },
      });

      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={fakeClient}>
            <QueryClientProvider client={new QueryClient()}>
              <PlaylistHeader playlist={playlist} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      expect(wrapper.queryByRole('button', { name: 'Share' })).toBeNull();
    });
  });

  it('sends Hotjar link copied event', async () => {
    const hotjarEventSent = jest.spyOn(AnalyticsFactory.hotjar(), 'event');

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
      mine: false,
    });

    const wrapper = render(
      <MemoryRouter>
        <ToastContainer />
        <PlaylistHeader playlist={playlist} />
      </MemoryRouter>,
    );

    const shareButton = await wrapper.findByRole('button', {
      name: 'Get view-only link',
    });

    fireEvent.click(shareButton);

    await waitFor(() =>
      expect(hotjarEventSent).toHaveBeenCalledWith(
        HotjarEvents.PlaylistShareableLinkCopied,
      ),
    );
  });

  it('has an options button', async () => {
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

    await waitFor(() => wrapper.getByText('Options')).then((it) => {
      expect(it).toBeInTheDocument();
    });
  });

  it('opens dropdown when clicked', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        features: {
          BO_WEB_APP_REORDER_VIDEOS_IN_PLAYLIST: true,
        },
      }),
    );

    const wrapper = render(
      <MemoryRouter>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <PlaylistHeader playlist={playlist} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then((it) => {
      expect(it).toBeInTheDocument();
    });

    await userEvent.click(wrapper.getByRole('button', { name: 'Options' }));

    expect(await wrapper.findByText('Edit')).toBeInTheDocument();
  });

  it('open edit modal when clicked on edit', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = render(
      <MemoryRouter>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <PlaylistHeader playlist={playlist} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      expect(it).toBeInTheDocument();
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    expect(await wrapper.findByTestId('playlist-modal')).toBeVisible();
  });
});
