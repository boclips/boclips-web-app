import { createBrowserHistory } from 'history';
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { createVideoWithThumbnail } from 'src/testSupport/createVideoWithTumbnail';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';

describe('editing a playlist', () => {
  let client = null;

  const videos = [
    createVideoWithThumbnail('111', 'Video One'),
    createVideoWithThumbnail('222', 'Video Two'),
    createVideoWithThumbnail('333', 'Video Three'),
    createVideoWithThumbnail('444', 'Video Four'),
    createVideoWithThumbnail('555', 'Video Five'),
  ];

  beforeEach(() => {
    client = new FakeBoclipsClient();
    videos.forEach((it) => client.videos.insertVideo(it));
    client.collections.setCurrentUser('myuserid');
    client.users.insertCurrentUser(
      UserFactory.sample({
        id: 'myuserid',
      }),
    );
  });

  it('edit playlist popup is displayed with populated values when edit button is clicked', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: '123',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);

    const history = createBrowserHistory();
    history.push('/playlists/123');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App
          apiClient={client}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={createReactQueryClient()}
        />
      </Router>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    const editPlaylistPopup = await wrapper.findByTestId('playlist-modal');
    expect(editPlaylistPopup).toBeVisible();
    expect(
      await within(editPlaylistPopup).findByText('Edit playlist'),
    ).toBeVisible();
    expect(
      await within(editPlaylistPopup).findByDisplayValue('Hello there'),
    ).toBeVisible();
    expect(
      await within(editPlaylistPopup).findByDisplayValue(
        'Very nice description',
      ),
    ).toBeVisible();
  });

  it('edit playlist button is not visible for playlists shared with me by other user', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: '123',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);
    const sharedPlaylist = { ...newPlaylist, id: '321', mine: false };
    client.collections.addToFake(sharedPlaylist);
    const history = createBrowserHistory();
    history.push('/playlists/321');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App
          apiClient={client}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </Router>,
    );

    await waitFor(() => wrapper.findByTestId('playlistTitle'));

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    expect(await wrapper.queryByText('Edit')).toBeNull();
  });

  it('can edit playlist', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: '123',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);

    const history = createBrowserHistory();
    history.push('/playlists/123');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App
          apiClient={client}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </Router>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
      target: { value: 'Good bye' },
    });
    fireEvent.change(wrapper.getByDisplayValue('Very nice description'), {
      target: { value: 'Not that nice description' },
    });

    fireEvent.click(wrapper.getByText('Save'));

    await waitForElementToBeRemoved(() =>
      wrapper.getByTestId('playlist-modal'),
    );

    expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
      'Good bye',
    );

    expect(await wrapper.findByTestId('playlistDescription')).toHaveTextContent(
      'Not that nice description',
    );

    const updatedPlaylist = await client.collections.get('123');
    expect(updatedPlaylist.title).toBe('Good bye');
    expect(updatedPlaylist.description).toBe('Not that nice description');

    const editPlaylistModal = wrapper.queryByTestId('playlist-modal');
    expect(editPlaylistModal).toBeNull();
    client.collections.clear();
  });

  it('edited playlist title is updated also in add to playlist modal', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: '123',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    await waitFor(() => wrapper.getByTestId('playlist-modal'));

    fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
      target: { value: 'Good bye' },
    });

    fireEvent.click(wrapper.getByText('Save'));

    await waitForElementToBeRemoved(() =>
      wrapper.getByTestId('playlist-modal'),
    );

    await waitFor(() => wrapper.getByTestId('playlistTitle')).then(
      (playlistTitle) => {
        expect(playlistTitle).toHaveTextContent('Good bye');
      },
    );

    const videoOne = wrapper.getByTestId('grid-card-for-Video One 111');
    const addToPlaylistButton = within(videoOne).getByRole('button', {
      name: 'Add or remove from playlist',
    });
    fireEvent.click(addToPlaylistButton);

    const addToPlaylistModal = await wrapper.findByTestId(
      'add-to-playlist-pop-up',
    );
    expect(
      await within(addToPlaylistModal).findByText('Good bye'),
    ).toBeVisible();
  });

  it('edited playlist title is updated also in navigation breadcrumbs', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: '32221',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/32221']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    await waitFor(() => wrapper.getByTestId('playlist-modal'));

    fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
      target: { value: 'Good bye' },
    });

    fireEvent.change(wrapper.getByDisplayValue('Very nice description'), {
      target: { value: 'Not that nice description' },
    });

    fireEvent.click(wrapper.getByText('Save'));

    await waitForElementToBeRemoved(() =>
      wrapper.getByTestId('playlist-modal'),
    );

    await waitFor(() => wrapper.getByTestId('playlist-title-link')).then(
      (breadcrumb) => {
        expect(breadcrumb).toHaveTextContent('Good bye');
      },
    );
  }, 1000);

  it('changes are not saved when playlist editing is cancelled', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: '333333',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/333333']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
      target: { value: 'Good bye' },
    });
    fireEvent.change(wrapper.getByDisplayValue('Very nice description'), {
      target: { value: 'Not that nice description' },
    });

    fireEvent.click(wrapper.getByText('Cancel'));

    expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
      'Hello there',
    );
    expect(await wrapper.findByTestId('playlistDescription')).toHaveTextContent(
      'Very nice description',
    );

    const updatedPlaylist = await client.collections.get('333333');
    expect(updatedPlaylist.title).toBe('Hello there');
    expect(updatedPlaylist.description).toBe('Very nice description');

    const editPlaylistModal = wrapper.queryByTestId('playlist-modal');
    expect(editPlaylistModal).toBeNull();
  });

  it('notification is displayed when playlist edit fails', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: 'remmm',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);
    client.collections.safeUpdate = jest.fn(() => Promise.reject());

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/remmm']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
      target: { value: 'Good bye' },
    });

    fireEvent.click(wrapper.getByText('Save'));

    expect(await wrapper.findByTestId('edit-playlist-failed')).toBeVisible();

    expect(await wrapper.findByTestId('playlistTitle')).toHaveTextContent(
      'Hello there',
    );
    expect(await wrapper.findByTestId('playlistDescription')).toHaveTextContent(
      'Very nice description',
    );

    const editPlaylistModal = wrapper.queryByTestId('playlist-modal');
    expect(editPlaylistModal).toBeVisible();
  });

  it('warning is displayed when required title not provided', async () => {
    const newPlaylist = CollectionFactory.sample({
      id: 'remmm01',
      title: 'Hello there',
      description: 'Very nice description',
      videos,
      owner: 'myuserid',
      mine: true,
    });

    client.collections.addToFake(newPlaylist);

    const wrapper = render(
      <MemoryRouter initialEntries={['/playlists/remmm01']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByText('Options')).then(async (it) => {
      await userEvent.click(it);
    });

    await userEvent.click(wrapper.getByText('Edit'));

    fireEvent.change(wrapper.getByDisplayValue('Hello there'), {
      target: { value: '' },
    });

    fireEvent.click(wrapper.getByText('Save'));

    expect(await wrapper.findByText('Playlist name is required')).toBeVisible();
  });
});
