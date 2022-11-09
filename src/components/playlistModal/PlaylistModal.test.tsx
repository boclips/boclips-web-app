import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { PlaylistModal } from 'src/components/playlistModal/PlaylistModal';

describe('Playlist modal', () => {
  it('without setting a name, it shows an error and does not call handleConfirm', async () => {
    const fakeClient = new FakeBoclipsClient();
    const handleConfirmSpy = jest.fn();
    const wrapper = renderWrapper(fakeClient, handleConfirmSpy);

    fireEvent.click(wrapper.getByRole('button', { name: 'Create playlist' }));

    const alert = wrapper.getByRole('alert');
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent('Playlist name is required');

    expect(handleConfirmSpy).not.toHaveBeenCalled();
  });
});

const renderWrapper = (
  fakeClient = new FakeBoclipsClient(),
  handleConfirm = jest.fn(),
) => {
  return render(
    <BoclipsClientProvider client={fakeClient}>
      <PlaylistModal
        handleConfirm={handleConfirm}
        onCancel={jest.fn()}
        isLoading={false}
        title="Create new playlist"
        confirmButtonText="Create playlist"
      />
    </BoclipsClientProvider>,
  );
};
