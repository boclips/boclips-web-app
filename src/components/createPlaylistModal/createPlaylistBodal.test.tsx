import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { CreatePlaylistBodal } from 'src/components/createPlaylistModal/createPlaylistBodal';
import { fireEvent, waitFor } from '@testing-library/react';

describe('Create new playlist modal', () => {
  it('creates a playlist with playlist name and description', async () => {
    const handleOnSuccess = jest.fn((data) => data);
    const wrapper = renderWrapper(
      new FakeBoclipsClient(),
      jest.fn(),
      handleOnSuccess,
    );

    fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
      target: { value: 'sail' },
    });

    fireEvent.change(wrapper.getByPlaceholderText('Add description'), {
      target: { value: 'hold the anchor' },
    });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

    await waitFor(() => expect(handleOnSuccess).toBeCalledTimes(1));
  });

  it('calls passed on cancel when cancelled', () => {
    const handleOnCancelled = jest.fn((data) => data);
    const wrapper = renderWrapper(
      new FakeBoclipsClient(),
      handleOnCancelled,
      jest.fn(),
    );

    fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
      target: { value: 'sail' },
    });

    fireEvent.change(wrapper.getByPlaceholderText('Add description'), {
      target: { value: 'hold the anchor' },
    });

    fireEvent.click(wrapper.getByRole('button', { name: 'Cancel' }));

    expect(handleOnCancelled).toBeCalledTimes(1);
  });

  it('returns an error when playlist name is empty', () => {
    const wrapper = renderWrapper();

    fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

    expect(wrapper.getByText('Playlist name is required')).toBeVisible();
  });

  it('creates a playlist without description', async () => {
    const handleOnSuccess = jest.fn((data) => data);
    const wrapper = renderWrapper(
      new FakeBoclipsClient(),
      jest.fn(),
      handleOnSuccess,
    );

    fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
      target: { value: 'sail' },
    });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

    expect(wrapper.queryByTestId('create-playlist-modal')).toBeInTheDocument();
    await waitFor(() => expect(handleOnSuccess).toBeCalledTimes(1));
  });

  it('call handleError when playlist creation fails', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.create = jest.fn(() => Promise.reject());
    const handleOnError = jest.fn();
    const wrapper = renderWrapper(
      fakeClient,
      jest.fn(),
      jest.fn(),
      handleOnError,
    );

    fireEvent.change(wrapper.getByPlaceholderText('Add name'), {
      target: { value: 'prove' },
    });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

    expect(wrapper.queryByTestId('create-playlist-modal')).toBeInTheDocument();
    await waitFor(() => expect(handleOnError).toBeCalledTimes(1));
  });
});

const renderWrapper = (
  fakeClient = new FakeBoclipsClient(),
  onCancel = jest.fn(),
  onSuccess = jest.fn(),
  onError = jest.fn(),
) => {
  return render(
    <BoclipsClientProvider client={fakeClient}>
      <CreatePlaylistBodal
        onCancel={onCancel}
        onSuccess={onSuccess}
        onError={onError}
      />
    </BoclipsClientProvider>,
  );
};
