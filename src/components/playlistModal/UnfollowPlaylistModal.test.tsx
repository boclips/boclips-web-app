import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { UnfollowPlaylistModal } from 'src/components/playlistModal/UnfollowPlaylistModal';

describe('Unfollow playlist modal', () => {
  it('displays a confirmation about playlist unfollow', async () => {
    const wrapper = renderWrapper();

    expect(await wrapper.getByText('Unfollow playlist')).toBeVisible();
    expect(await wrapper.getByText('Original playlist')).toBeVisible();
    expect(
      await wrapper.getByRole('button', { name: 'Yes, unfollow' }),
    ).toBeVisible();
  });

  const renderWrapper = (
    fakeClient = new FakeBoclipsClient(),
    onCancel = jest.fn(),
  ) => {
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <UnfollowPlaylistModal
          onCancel={onCancel}
          playlist={CollectionFactory.sample({
            title: 'Original playlist',
            description: 'Description of original playlist',
            mine: false,
          })}
        />
      </BoclipsClientProvider>,
    );
  };
});
