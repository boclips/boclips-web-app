import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
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

const setPlaylistsFeature = (client: FakeBoclipsClient, enabled: boolean) =>
  client.users.insertCurrentUser(
    UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: enabled } }),
  );

const renderLibraryView = (client: BoclipsClient) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/library']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('LibraryView', () => {
  describe('Feature disabled', () => {
    it('shows a blank page if feature flag not set', async () => {
      const client = new FakeBoclipsClient();
      setPlaylistsFeature(client, false);
      const wrapper = renderLibraryView(client);
      expect(await wrapper.queryByText('Your Library')).not.toBeInTheDocument();
    });
  });

  describe('Feature enabled', () => {
    it('loads the title for library page', async () => {
      const client = new FakeBoclipsClient();
      setPlaylistsFeature(client, true);
      const wrapper = renderLibraryView(client);
      expect(await wrapper.findByText('Your Library')).toBeVisible();
    });

    // TODO() - this was a false positive, need to update the FakeApiClient for this to work properly
    xit('renders playlists created by the user', async () => {
      const client = new FakeBoclipsClient();
      setPlaylistsFeature(client, true);

      const playlists = [
        CollectionFactory.sample({ title: 'Playlist 1' }),
        CollectionFactory.sample({ title: 'Playlist 2' }),
      ];

      playlists.forEach((it) => client.collections.addToFake(it));

      const wrapper = renderLibraryView(client);

      expect(await wrapper.findByText('Playlist 1')).toBeVisible();
      expect(await wrapper.findByText('Playlist 2')).toBeVisible();
    });

    describe('Creating playlists', () => {
      it('shows Create new playlist button', async () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);

        expect(
          await wrapper.findByRole('button', { name: 'Create new playlist' }),
        ).toBeVisible();
      });

      it('opens a modal when clicking the Create new playlist button', async () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);

        const createPlaylistButton = await wrapper.findByRole('button', {
          name: 'Create new playlist',
        });

        expect(wrapper.queryByLabelText('Create new playlist')).toBeNull();

        fireEvent.click(createPlaylistButton);

        expect(wrapper.getByLabelText('Create new playlist')).toBeVisible();
        expect(wrapper.getByLabelText('*Playlist name')).toBeVisible();
        expect(wrapper.getByPlaceholderText('Give it a name')).toBeVisible();
        expect(wrapper.getByLabelText('Description')).toBeVisible();
        expect(wrapper.getByPlaceholderText('Add description')).toBeVisible();
        expect(wrapper.getByRole('button', { name: 'Cancel' })).toBeVisible();
        expect(
          wrapper.getByRole('button', { name: 'Create new playlist' }),
        ).toBeVisible();
      });

      it('can cancel modal', () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);

        openPlaylistCreationModal(wrapper);

        fireEvent.click(wrapper.getByRole('button', { name: 'Cancel' }));

        const modal = wrapper.queryByLabelText('Create new playlist');
        expect(modal).not.toBeInTheDocument();
      });

      it('cannot create a playlist without a title', () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);

        openPlaylistCreationModal(wrapper);

        fireEvent.click(
          wrapper.getByRole('button', { name: 'Create playlist' }),
        );
        const modal = wrapper.queryByLabelText('Create new playlist');
        expect(modal).toBeVisible();
        expect(wrapper.getByText('Playlist name is required')).toBeVisible();
      });

      it('can create a playlist with title and description', async () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);

        openPlaylistCreationModal(wrapper);
        fillPlaylistName(wrapper, 'My new playlist');
        fillPlaylistDescription(wrapper, 'Blabla new playlist');
        confirmPlaylistCreationModal(wrapper);

        await waitForElementToBeRemoved(
          wrapper.queryByLabelText('Create new playlist'),
        );

        expect(await wrapper.findByText('My new playlist')).toBeVisible();
        expect(await wrapper.findByText('Blabla new playlist')).toBeVisible();
      });

      it('can display an error message on failed playlist creation', async () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);
        client.collections.setCreateCollectionErrorMessage('500 server error');

        openPlaylistCreationModal(wrapper);
        fillPlaylistName(wrapper, 'My new playlist');
        confirmPlaylistCreationModal(wrapper);

        expect(
          await wrapper.findByText('Error: Failed to create new playlist'),
        ).toBeVisible();
        expect(
          await wrapper.findByText('Please refresh the page and try again'),
        ).toBeVisible();
      });

      it('display spinner in confirm button after creating playlist', async () => {
        const client = new FakeBoclipsClient();
        setPlaylistsFeature(client, true);
        const wrapper = renderLibraryView(client);

        openPlaylistCreationModal(wrapper);
        fillPlaylistName(wrapper, 'My new playlist');
        confirmPlaylistCreationModal(wrapper);

        fireEvent.click(
          wrapper.getByRole('button', { name: 'Create playlist' }),
        );

        await waitFor(() => {
          expect(wrapper.getByTestId('spinner')).toBeInTheDocument();
        });
      });

      const openPlaylistCreationModal = (wrapper: RenderResult) =>
        fireEvent.click(
          wrapper.getByRole('button', { name: 'Create new playlist' }),
        );

      const fillPlaylistField = (
        wrapper: RenderResult,
        label: string,
        value: string,
      ) => userEvent.type(wrapper.getByLabelText(label), value);

      const fillPlaylistName = (wrapper: RenderResult, value: string) =>
        fillPlaylistField(wrapper, '*Playlist name', value);

      const fillPlaylistDescription = (wrapper: RenderResult, value: string) =>
        fillPlaylistField(wrapper, 'Description', value);

      const confirmPlaylistCreationModal = (wrapper: RenderResult) =>
        fireEvent.click(
          wrapper.getByRole('button', { name: 'Create playlist' }),
        );
    });
  });
});
