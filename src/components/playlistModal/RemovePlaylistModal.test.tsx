import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { RemovePlaylistModal } from 'src/components/playlistModal/RemovePlaylistModal';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

describe('Remove playlist modal', () => {
  it('displays a warning about playlist deletion', async () => {
    const wrapper = renderWrapper();

    expect(
      await wrapper.getByText('Remove the', { exact: false }),
    ).toBeVisible();
    expect(await wrapper.getByText('Original playlist')).toBeVisible();
    expect(
      await wrapper.getByText('You will not be able to recover it.'),
    ).toBeVisible();
  });

  const renderWrapper = (
    fakeClient = new FakeBoclipsClient(),
    onCancel = jest.fn(),
  ) => {
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <RemovePlaylistModal
          onCancel={onCancel}
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
