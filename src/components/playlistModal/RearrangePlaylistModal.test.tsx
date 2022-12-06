import RearrangeModal from 'src/components/playlistModal/RearrangePlaylistModal';
import { render } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('Rearrange modal', () => {
  it('displays title, subtitle', () => {
    const wrapper = render(
      <RearrangeModal
        confirmButtonText="Update"
        handleConfirm={jest.fn()}
        onCancel={jest.fn()}
        playlist={CollectionFactory.sample({
          mine: true,
        })}
      />,
    );

    expect(wrapper.getByText('Rearrange videos')).toBeVisible();
    expect(
      wrapper.getByText(
        'Drag & drop video titles to put them in your desired order:',
      ),
    ).toBeVisible();
  });

  it('displays videos list', () => {
    const wrapper = render(
      <RearrangeModal
        confirmButtonText="Update"
        handleConfirm={jest.fn()}
        onCancel={jest.fn()}
        playlist={CollectionFactory.sample({
          videos: [VideoFactory.sample({ title: 'video-1' })],
          mine: true,
        })}
      />,
    );

    expect(wrapper.getByText('video-1')).toBeVisible();
  });
});
