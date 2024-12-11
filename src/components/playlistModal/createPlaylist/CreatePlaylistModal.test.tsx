import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { render } from '@src/testSupport/render';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import React from 'react';
import { CreatePlaylistModal } from '@components/playlistModal/createPlaylist/CreatePlaylistModal';
import { waitFor } from '@testing-library/react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';

describe('Create new playlist modal', () => {
  it('creates a playlist with playlist name and description', async () => {
    const handleOnSuccess = vi.fn((data) => data);
    const wrapper = renderWrapper(
      new FakeBoclipsClient(),
      vi.fn(),
      handleOnSuccess,
    );

    await userEvent.type(wrapper.getByPlaceholderText('Add name'), 'sail');

    await userEvent.type(
      wrapper.getByPlaceholderText('Add description'),
      'hold the anchor',
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );

    await waitFor(() => expect(handleOnSuccess).toBeCalledTimes(1));
  });

  it('calls passed on cancel when cancelled', async () => {
    const handleOnCancelled = vi.fn((data) => data);
    const wrapper = renderWrapper(
      new FakeBoclipsClient(),
      handleOnCancelled,
      vi.fn(),
    );

    await userEvent.type(wrapper.getByPlaceholderText('Add name'), 'sail');

    await userEvent.type(
      wrapper.getByPlaceholderText('Add description'),
      'hold the anchor',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Cancel' }));

    expect(handleOnCancelled).toBeCalledTimes(1);
  });

  it('returns an error when playlist name is empty', async () => {
    const wrapper = renderWrapper();

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );

    expect(wrapper.getByText('Playlist name is required')).toBeVisible();
  });

  it('creates a playlist without description', async () => {
    const handleOnSuccess = vi.fn((data) => data);
    const wrapper = renderWrapper(
      new FakeBoclipsClient(),
      vi.fn(),
      handleOnSuccess,
    );

    await userEvent.type(wrapper.getByPlaceholderText('Add name'), 'sail');

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );

    expect(wrapper.queryByTestId('playlist-modal')).toBeInTheDocument();
    await waitFor(() => expect(handleOnSuccess).toBeCalledTimes(1));
  });

  it('call handleError when playlist creation fails', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.create = vi.fn(() => Promise.reject());
    const handleOnError = vi.fn();
    const wrapper = renderWrapper(fakeClient, vi.fn(), vi.fn(), handleOnError);

    await userEvent.type(wrapper.getByPlaceholderText('Add name'), 'prove');

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );

    expect(wrapper.queryByTestId('playlist-modal')).toBeInTheDocument();
    await waitFor(() => expect(handleOnError).toBeCalledTimes(1));
  });

  it('can use an existing playlist as a template', async () => {
    const apiClient = new FakeBoclipsClient();
    const createPlaylistSpy = vi
      .spyOn(apiClient.collections, 'create')
      .mockImplementation(() => Promise.resolve('playlist-id'));

    const assets = [
      CollectionAssetFactory.sample({
        id: 'video1',
        video: VideoFactory.sample({ id: 'video1' }),
      }),
      CollectionAssetFactory.sample({
        id: 'video2',
        video: VideoFactory.sample({ id: 'video2' }),
      }),
      CollectionAssetFactory.sample({
        id: 'video3',
        video: VideoFactory.sample({ id: 'video3' }),
      }),
    ];

    const playlist = CollectionFactory.sample({
      title: 'Original playlist',
      description: 'Description of original playlist',
      assets,
      mine: false,
    });

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <CreatePlaylistModal
          playlist={playlist}
          onCancel={vi.fn}
          onSuccess={vi.fn}
          onError={vi.fn}
        />
      </BoclipsClientProvider>,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );
    await waitFor(() =>
      expect(createPlaylistSpy).toHaveBeenCalledWith({
        title: 'Original playlist',
        description: 'Description of original playlist',
        videos: [...assets.map((a) => a.id)],
      }),
    );
  });
});

const renderWrapper = (
  fakeClient = new FakeBoclipsClient(),
  onCancel = vi.fn(),
  onSuccess = vi.fn(),
  onError = vi.fn(),
) => {
  return render(
    <BoclipsClientProvider client={fakeClient}>
      <CreatePlaylistModal
        onCancel={onCancel}
        onSuccess={onSuccess}
        onError={onError}
      />
    </BoclipsClientProvider>,
  );
};
