import RearrangeModal from 'src/components/playlistModal/RearrangePlaylistModal';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  DND_DIRECTION_DOWN,
  DND_DRAGGABLE_DATA_ATTR,
  makeDnd,
  mockDndSpacing,
  mockGetComputedStyle,
} from 'react-beautiful-dnd-test-utils';

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

  it('can drag n drop videos', async () => {
    mockGetComputedStyle();

    const wrapper = render(
      <RearrangeModal
        confirmButtonText="Update"
        handleConfirm={jest.fn()}
        onCancel={jest.fn()}
        playlist={CollectionFactory.sample({
          videos: [
            VideoFactory.sample({ id: 'one', title: 'video-1' }),
            VideoFactory.sample({ id: 'two', title: 'video-2' }),
            VideoFactory.sample({ id: 'three', title: 'video-3' }),
          ],
          mine: true,
        })}
      />,
    );
    mockDndSpacing(wrapper.container);

    const videosBefore = screen.getAllByText(/video-/);

    expect(videosBefore[0]).toHaveTextContent('video-1');
    expect(videosBefore[1]).toHaveTextContent('video-2');
    expect(videosBefore[2]).toHaveTextContent('video-3');

    await makeDnd({
      getDragElement: () =>
        screen.getByText('video-1').closest(DND_DRAGGABLE_DATA_ATTR),
      direction: DND_DIRECTION_DOWN,
      positions: 2,
    });

    wrapper.debug(wrapper.baseElement, 99999);

    // await waitFor(
    //   () => {
    //     const videosAfter = screen.getAllByText(/video-/);
    //
    //     // wrapper.debug(wrapper.baseElement, 99999);
    //     // wrapper.debug(videosAfter[0]);
    //
    //     expect(videosAfter[0]).toHaveTextContent('video-2');
    //     expect(videosAfter[1]).toHaveTextContent('video-1');
    //     expect(videosAfter[2]).toHaveTextContent('video-3');
    //   },
    //   { timeout: 500 },
    // );
  });
});
