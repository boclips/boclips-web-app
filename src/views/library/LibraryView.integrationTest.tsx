import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClient } from 'boclips-api-client';
import userEvent from '@testing-library/user-event';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('LibraryView', () => {
  const renderLibraryView = (client: BoclipsClient) =>
    render(
      <MemoryRouter initialEntries={['/library']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

  describe('when playlists feature is enabled', () => {
    const client = new FakeBoclipsClient();
    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
      );
      renderLibraryView(client);
    });

    it('loads the title for library page', async () => {
      expect(await screen.findByText('Your Library')).toBeVisible();
    });

    describe('Creating playlists', () => {
      it('shows Create new playlist button', async () => {
        expect(
          await screen.findByRole('button', { name: 'Create new playlist' }),
        ).toBeVisible();
      });

      it('opens a modal when clicking the Create new playlist button', async () => {
        const createPlaylistButton = await screen.findByRole('button', {
          name: 'Create new playlist',
        });

        expect(screen.queryByLabelText('Create new playlist')).toBeNull();

        fireEvent.click(createPlaylistButton);

        expect(screen.getByLabelText('Create new playlist')).toBeVisible();
        expect(screen.getByLabelText('*Playlist name')).toBeVisible();
        expect(screen.getByPlaceholderText('Give it a name')).toBeVisible();
        expect(screen.getByLabelText('Description')).toBeVisible();
        expect(screen.getByPlaceholderText('Add description')).toBeVisible();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
        expect(
          screen.getByRole('button', { name: 'Create new playlist' }),
        ).toBeVisible();
      });

      it('can cancel modal', () => {
        openPlaylistCreationModal();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        const modal = screen.queryByLabelText('Create new playlist');
        expect(modal).not.toBeInTheDocument();
      });

      it('cannot create a playlist without a title', () => {
        openPlaylistCreationModal();

        fireEvent.click(
          screen.getByRole('button', { name: 'Create playlist' }),
        );
        const modal = screen.queryByLabelText('Create new playlist');
        expect(modal).toBeVisible();
        expect(screen.getByText('Playlist name is required')).toBeVisible();
      });

      it('can create a playlist with title and description', async () => {
        openPlaylistCreationModal();

        const titleInput = screen.getByLabelText('*Playlist name');
        userEvent.type(titleInput, 'My new playlist');

        const descriptionInput = screen.getByLabelText('Description');
        userEvent.type(descriptionInput, 'Blabla new playlist');

        fireEvent.click(
          screen.getByRole('button', { name: 'Create playlist' }),
        );

        await waitForElementToBeRemoved(
          screen.queryByLabelText('Create new playlist'),
        );

        expect(await screen.findByText('My new playlist')).toBeVisible();
        expect(await screen.findByText('Blabla new playlist')).toBeVisible();
      });

      const openPlaylistCreationModal = () =>
        fireEvent.click(
          screen.getByRole('button', { name: 'Create new playlist' }),
        );
    });
  });

  describe('when playlists feature is disabled', () => {
    const client = new FakeBoclipsClient();
    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          features: { BO_WEB_APP_ENABLE_PLAYLISTS: false },
        }),
      );

      renderLibraryView(client);
    });

    it('shows a blank page', async () => {
      expect(await screen.queryByText('Your Library')).not.toBeInTheDocument();
    });
  });

  const playlists = [
    CollectionFactory.sample({
      title: 'box',
    }),
    CollectionFactory.sample({
      title: 'print',
    }),
    CollectionFactory.sample({
      title: 'scorn',
    }),
    CollectionFactory.sample({
      title: 'sing',
    }),
    CollectionFactory.sample({
      title: 'group',
    }),
    CollectionFactory.sample({
      title: 'kneel',
    }),
  ];

  it('Displays tiles for retrieved playlists', async () => {
    const fakeClient = new FakeBoclipsClient();
    const queryClient = new QueryClient();

    playlists.forEach((playlist) => {
      fakeClient.collections.addToFake(playlist);
    });

    const wrapper = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/library']}>
          <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    playlists.map(async (it) => {
      expect(await wrapper.findByText(it.title)).toBeInTheDocument();
    });
  });
});

it('can display an error message on failed playlist creation', async () => {
  const client = new FakeBoclipsClient();
  client.users.insertCurrentUser(
    UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
  );

  const wrapper = render(
    <MemoryRouter initialEntries={['/library']}>
      <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
    </MemoryRouter>,
  );
  expect(
    await wrapper.findByRole('button', { name: 'Create new playlist' }),
  ).toBeVisible();

  fireEvent.click(wrapper.getByRole('button', { name: 'Create new playlist' }));

  const titleInput = wrapper.getByLabelText('*Playlist name');
  userEvent.type(titleInput, 'My new playlist');

  client.collections.setCreateCollectionErrorMessage('500 server error');

  fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

  expect(
    await wrapper.findByText('Error: Failed to create new playlist'),
  ).toBeVisible();
  expect(
    await wrapper.findByText('Please refresh the page and try again'),
  ).toBeVisible();
});
