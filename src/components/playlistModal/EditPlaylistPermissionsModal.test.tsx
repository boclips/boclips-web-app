import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@src/testSupport/render';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { EditPlaylistPermissionsModal } from '@components/playlistModal/EditPlaylistPermissionsModal';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';

describe('Edit playlist permissions modal', () => {
  it('displays the modal', async () => {
    const wrapper = renderWrapper();

    expect(await wrapper.getByText('Share this playlist')).toBeVisible();
    expect(
      await wrapper.getByText('Select your sharing preference:'),
    ).toBeVisible();
  });

  const renderWrapper = (
    fakeClient = new FakeBoclipsClient(),
    onCancel = vi.fn(),
    handleClick = vi.fn(),
  ) => {
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <EditPlaylistPermissionsModal
          onCancel={onCancel}
          handleClick={handleClick}
          playlist={CollectionFactory.sample({
            title: 'Original playlist',
            description: 'Description of original playlist',
            mine: true,
            permissions: { anyone: CollectionPermission.EDIT },
          })}
        />
      </BoclipsClientProvider>,
    );
  };
});
