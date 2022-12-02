import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { RemovePlaylistModal } from 'src/components/playlistModal/RemovePlaylistModal';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { fireEvent } from '@testing-library/react';

describe('Remove playlist modal', () => {
  it('displays a warning about playlist deletion', async () => {
    const wrapper = renderWrapper();

    expect(await wrapper.getByText('Original playlist')).toBeVisible();
    expect(
      await wrapper.getByText(
        'Removing a playlist is a permanent action and cannot be undone.',
      ),
    ).toBeVisible();
  });

  it('redirects to playlists page after removing a playlist', async () => {
    const wrapper = renderWrapper();

    const removeButton = await wrapper.getByRole('button', {
      name: 'Yes, remove it',
    });

    expect(removeButton).toBeVisible();
    fireEvent.click(removeButton);
  });

  const renderWrapper = (
    fakeClient = new FakeBoclipsClient(),
    onCancel = jest.fn(),
    showErrorNotification = jest.fn(),
  ) => {
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <RemovePlaylistModal
          onCancel={onCancel}
          showErrorNotification={showErrorNotification}
          playlist={CollectionFactory.sample({
            title: 'Original playlist',
            description: 'Description of original playlist',
            mine: true,
          })}
        />
      </BoclipsClientProvider>,
    );
  };
});
