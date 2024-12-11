import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@src/testSupport/render';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import React from 'react';
import { PlaylistModal } from '@components/playlistModal/PlaylistModal';
import userEvent from '@testing-library/user-event';

describe('Playlist modal', () => {
  it('without setting a name, it shows an error and does not call handleConfirm', async () => {
    const fakeClient = new FakeBoclipsClient();
    const handleConfirmSpy = vi.fn();
    const wrapper = renderWrapper(fakeClient, handleConfirmSpy);

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create playlist' }),
    );

    const alert = wrapper.getByRole('alert');
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent('Playlist name is required');

    expect(handleConfirmSpy).not.toHaveBeenCalled();
  });
});

const renderWrapper = (
  fakeClient = new FakeBoclipsClient(),
  handleConfirm = vi.fn(),
) => {
  return render(
    <BoclipsClientProvider client={fakeClient}>
      <PlaylistModal
        handleConfirm={handleConfirm}
        onCancel={vi.fn()}
        isLoading={false}
        title="Create new playlist"
        confirmButtonText="Create playlist"
      />
    </BoclipsClientProvider>,
  );
};
