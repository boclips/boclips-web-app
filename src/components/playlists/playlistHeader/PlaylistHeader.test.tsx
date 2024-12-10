import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import PlaylistHeader from '@components/playlists/playlistHeader/PlaylistHeader';
import { Constants } from '@src/AppConstants';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { renderWithClients } from '@src/testSupport/render';

describe('Playlist Header', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  const renderWrapper = (
    playlist: Collection,
    fakeClient: FakeBoclipsClient = new FakeBoclipsClient(),
  ) => {
    return render(
      <MemoryRouter>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <PlaylistHeader playlist={playlist} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );
  };

  it('has visible playlist title', async () => {
    const title = 'test playlist';
    const playlist = CollectionFactory.sample({
      id: '123',
      title,
      description: 'Description',
    });

    const wrapper = renderWrapper(playlist);

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

    const wrapper = renderWrapper(playlist);
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

    const wrapper = renderWrapper(playlist);
    expect(wrapper.getByText('By: The Owner')).toBeVisible();
  });

  describe('share button for LIBRARY', () => {
    it('view-only playlist has a view-only share button for non-owner', async () => {
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
        permissions: { anyone: CollectionPermission.VIEW_ONLY },
      });

      const wrapper = renderWrapper(playlist);

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

      const wrapper = renderWrapper(playlist);
      expect(
        await wrapper.findByRole('button', { name: 'Share' }),
      ).toBeVisible();
    });

    it('copies the playlist link on the playlist page and shows notification', async () => {
      vi.spyOn(navigator.clipboard, 'writeText');
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: false,
      });

      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <QueryClientProvider client={new QueryClient()}>
              <ToastContainer />
              <PlaylistHeader playlist={playlist} />
            </QueryClientProvider>
          </BoclipsClientProvider>
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
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
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

      const wrapper = renderWrapper(playlist, fakeClient);

      expect(
        wrapper.queryByRole('button', { name: 'Get view-only link' }),
      ).toBeNull();
    });

    it('shows share link button', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );
      const playlist = CollectionFactory.sample({
        id: '123',
        title: 'Playlist title',
        description: 'Description',
        mine: true,
        permissions: { anyone: CollectionPermission.VIEW_ONLY },
      });

      const wrapper = renderWrapper(playlist, fakeClient);

      expect(
        await wrapper.findByRole('button', { name: 'Share' }),
      ).toBeVisible();
    });

    it('editable playlist has a share button for non-owner', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
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

      const wrapper = renderWrapper(playlist, fakeClient);

      expect(wrapper.queryByRole('button', { name: 'Share' })).toBeNull();
    });
  });

  it('sends Hotjar link copied event', async () => {
    const hotjarEventSent = vi.spyOn(AnalyticsFactory.hotjar(), 'event');

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
      mine: false,
    });

    const wrapper = render(
      <MemoryRouter>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <ToastContainer />
            <PlaylistHeader playlist={playlist} />
          </QueryClientProvider>
        </BoclipsClientProvider>
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

  it('has an options button for LIBRARY', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.LIBRARY],
          type: AccountType.STANDARD,
        },
      }),
    );

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
    });

    const wrapper = renderWrapper(playlist, fakeClient);

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

    const wrapper = renderWrapper(playlist, new FakeBoclipsClient());

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

    const wrapper = renderWrapper(playlist);

    await waitFor(() => wrapper.getByText('Options')).then((it) => {
      expect(it).toBeInTheDocument();
    });

    await userEvent.click(wrapper.getByRole('button', { name: 'Options' }));

    expect(await wrapper.findByText('Edit')).toBeInTheDocument();

    await userEvent.click(
      wrapper.getByRole('menuitem', { name: 'Edit playlist' }),
    );
  });

  it('buttons are not displayed when requested', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Playlist title',
      description: 'Description',
      mine: false,
      permissions: { anyone: CollectionPermission.EDIT },
    });

    const wrapper = renderWithClients(
      <PlaylistHeader playlist={playlist} showButtons={false} />,
    );
    expect(wrapper.queryByRole('button', { name: 'Share' })).toBeNull();
    expect(wrapper.queryByRole('button', { name: 'Options' })).toBeNull();
  });
});
