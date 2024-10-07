import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import dayjs from 'src/day-js';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { ToastContainer } from 'react-toastify';
import PlaylistVideoBookmarkButton from 'src/components/shareLinkButton/playlistsBookmark/PlaylistVideoBookmarkButton';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { lastEvent } from 'src/testSupport/lastEvent';

describe('Bookmark modal for playlists', () => {
  const video = VideoFactory.sample({ id: 'video-id' });
  const nonBookmarkedCollectionId = 'non-segment';
  const bookmarkedCollectionId = 'has-segments';
  const apiClient = new FakeBoclipsClient();

  beforeEach(() => {
    apiClient.videos.clear();
    apiClient.collections.clear();

    apiClient.videos.insertVideo(video);
    apiClient.collections.addToFake(
      CollectionFactory.sample({
        id: nonBookmarkedCollectionId,
        videos: [video],
      }),
    );
    apiClient.collections.addToFake(
      CollectionFactory.sample({
        id: bookmarkedCollectionId,
        videos: [video],
        segments: {
          'video-id': { start: 10, end: 11 },
        },
      }),
    );
  });

  it(`allows setting start and end time for video`, async () => {
    const wrapper = renderBookmarkButton(
      video,
      nonBookmarkedCollectionId,
      apiClient,
    );
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Bookmark custom timings for this video'),
    ).toBeVisible();

    const startCheckbox = wrapper.getByRole('checkbox', {
      name: 'Start time enabled',
    });
    expect(startCheckbox).toBeVisible();

    const startTimeInput = wrapper.getByLabelText('Start time:');
    expect(startTimeInput).toBeVisible();
    expect(startTimeInput).toBeDisabled();

    await userEvent.click(startCheckbox);
    expect(startCheckbox).toBeChecked();
    expect(startTimeInput).toBeEnabled();

    fireEvent.change(startTimeInput, { target: { value: '00:32' } });

    const endCheckbox = wrapper.getByRole('checkbox', {
      name: 'End time enabled',
      checked: false,
    });
    expect(endCheckbox).toBeVisible();

    const endTimeInput = wrapper.getByLabelText('End time:');
    expect(endTimeInput).toBeVisible();
    expect(endTimeInput).toBeDisabled();

    await userEvent.click(endCheckbox);
    expect(endCheckbox).toBeChecked();

    expect(endTimeInput).toBeEnabled();

    fireEvent.change(endTimeInput, { target: { value: '00:55' } });

    await userEvent.click(wrapper.getByText('Set'));

    const updatedPlaylist = await apiClient.collections.get(
      nonBookmarkedCollectionId,
    );

    await waitFor(() => {
      expect(updatedPlaylist.segments[video.id].start).toEqual(32);
      expect(updatedPlaylist.segments[video.id].end).toEqual(55);
      expect(
        wrapper.getByText('Video bookmark has been updated'),
      ).toBeInTheDocument();
    });
  });

  it(`allows removing start and end time for video`, async () => {
    const wrapper = renderBookmarkButton(
      video,
      bookmarkedCollectionId,
      apiClient,
    );

    await openShareModal(wrapper);

    const endCheckbox = wrapper.getByRole('checkbox', {
      name: 'End time enabled',
    });

    const startCheckbox = wrapper.getByRole('checkbox', {
      name: 'Start time enabled',
    });
    const startTimeInput = wrapper.getByLabelText('Start time:');
    const endTimeInput = wrapper.getByLabelText('End time:');

    await waitFor(() => {
      expect(startTimeInput).not.toBeDisabled();
      expect(endTimeInput).not.toBeDisabled();
      expect(endCheckbox).toBeChecked();
      expect(startCheckbox).toBeChecked();
    });

    await userEvent.click(startCheckbox);
    await userEvent.click(endCheckbox);

    expect(endCheckbox).not.toBeChecked();
    expect(startCheckbox).not.toBeChecked();

    await userEvent.click(wrapper.getByText('Set'));

    const updatedPlaylist = await apiClient.collections.get(
      bookmarkedCollectionId,
    );

    await waitFor(() => {
      expect(updatedPlaylist.segments[video.id]).toBeUndefined();
      expect(
        wrapper.getByText('Video bookmark has been updated'),
      ).toBeInTheDocument();
    });
  });

  it(`validates start time > end time`, async () => {
    const wrapper = renderBookmarkButton();
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Bookmark custom timings for this video'),
    ).toBeVisible();

    const startTimeInput = wrapper.getByRole('textbox', {
      name: 'Start time:',
    });

    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'Start time enabled',
        checked: false,
      }),
    );

    await userEvent.type(startTimeInput, '00:10');

    const endTimeInput = wrapper.getByRole('textbox', {
      name: 'End time:',
    });

    await userEvent.click(
      wrapper.getByRole('checkbox', {
        name: 'End time enabled',
        checked: false,
      }),
    );

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, '00:10');

    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, '00:02');

    await userEvent.tab();

    expect(
      await wrapper.findByText('Please enter valid start and end times'),
    ).toBeVisible();
  });

  it(`sends a platform interaction event when set bookmark modal is opened`, async () => {
    const wrapper = renderBookmarkButton(
      video,
      nonBookmarkedCollectionId,
      apiClient,
    );
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Bookmark custom timings for this video'),
    ).toBeVisible();

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'SET_BOOKMARK_MODAL_OPENED',
        anonymous: false,
      });
    });
  });

  it(`sends a platform interaction event when update bookmark modal is opened`, async () => {
    const wrapper = renderBookmarkButton(
      video,
      bookmarkedCollectionId,
      apiClient,
    );
    await openShareModal(wrapper);
    await waitFor(() => {
      expect(
        wrapper.getByText('Update bookmarked timings for this video'),
      ).toBeVisible();
    });

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'UPDATE_BOOKMARK_MODAL_OPENED',
        anonymous: false,
      });
    });
  });

  it(`sends a platform interaction event when bookmark is set`, async () => {
    const wrapper = renderBookmarkButton(
      video,
      nonBookmarkedCollectionId,
      apiClient,
    );
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Bookmark custom timings for this video'),
    ).toBeVisible();

    const startCheckbox = wrapper.getByRole('checkbox', {
      name: 'Start time enabled',
    });
    const startTimeInput = wrapper.getByLabelText('Start time:');

    await userEvent.click(startCheckbox);
    fireEvent.change(startTimeInput, { target: { value: '00:32' } });

    const endCheckbox = wrapper.getByRole('checkbox', {
      name: 'End time enabled',
      checked: false,
    });
    const endTimeInput = wrapper.getByLabelText('End time:');
    await userEvent.click(endCheckbox);
    fireEvent.change(endTimeInput, { target: { value: '00:55' } });

    await userEvent.click(wrapper.getByText('Set'));
    await waitFor(() => {
      expect(
        wrapper.getByText('Video bookmark has been updated'),
      ).toBeInTheDocument();
    });

    const updatedPlaylist = await apiClient.collections.get(
      nonBookmarkedCollectionId,
    );

    await waitFor(() => {
      expect(updatedPlaylist?.segments[video.id].start).toEqual(32);
      expect(updatedPlaylist?.segments[video.id].end).toEqual(55);
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'SET_BOOKMARK_MODAL_SUBMITTED',
        anonymous: false,
      });
    });
  });
  it(`sends a platform interaction event when bookmark is updated`, async () => {
    const wrapper = renderBookmarkButton(
      video,
      bookmarkedCollectionId,
      apiClient,
    );
    await openShareModal(wrapper);

    expect(
      await wrapper.findByText('Update bookmarked timings for this video'),
    ).toBeVisible();
    const startTimeInput = wrapper.getByLabelText('Start time:');

    fireEvent.change(startTimeInput, { target: { value: '00:32' } });

    const endTimeInput = wrapper.getByLabelText('End time:');
    fireEvent.change(endTimeInput, { target: { value: '00:55' } });

    await userEvent.click(wrapper.getByText('Set'));

    const updatedPlaylist = await apiClient.collections.get(
      bookmarkedCollectionId,
    );

    await waitFor(() => {
      expect(updatedPlaylist?.segments[video.id].start).toEqual(32);
      expect(updatedPlaylist?.segments[video.id].end).toEqual(55);
      expect(
        wrapper.getByText('Video bookmark has been updated'),
      ).toBeInTheDocument();
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'UPDATE_BOOKMARK_MODAL_SUBMITTED',
        anonymous: false,
      });
    });
  });

  it('removes the tabIndex on main element, to allow copying the text', async () => {
    const wrapper = renderBookmarkButton();

    expect(wrapper.getByRole('main')).toHaveAttribute('tabIndex', '-1');

    await openShareModal(wrapper);

    await waitFor(() =>
      expect(wrapper.getByRole('main')).not.toHaveAttribute('tabIndex'),
    );
  });

  it('displays an error message if updating the bookmark fails', async () => {
    apiClient.collections.safeUpdate = jest
      .fn()
      .mockRejectedValue(new Error('Network Error'));

    const wrapper = renderBookmarkButton(
      video,
      nonBookmarkedCollectionId,
      apiClient,
    );
    await openShareModal(wrapper);

    const endCheckbox = wrapper.getByRole('checkbox', {
      name: 'End time enabled',
    });

    const startCheckbox = wrapper.getByRole('checkbox', {
      name: 'Start time enabled',
    });

    await userEvent.click(endCheckbox);
    await userEvent.click(startCheckbox);

    expect(endCheckbox).toBeChecked();

    const startTimeInput = wrapper.getByLabelText('Start time:');
    const endTimeInput = wrapper.getByLabelText('End time:');

    expect(startTimeInput).toBeEnabled();
    expect(endTimeInput).toBeEnabled();

    fireEvent.change(startTimeInput, { target: { value: '00:32' } });
    fireEvent.change(endTimeInput, { target: { value: '00:55' } });

    await userEvent.click(wrapper.getByText('Set'));

    await waitFor(() => {
      expect(
        wrapper.getByText('An error occurred, please try again'),
      ).toBeInTheDocument();
    });
  });
});

const renderBookmarkButton = (
  video: Video = VideoFactory.sample({
    id: 'video-1',
    title: 'Tractor Video',
    playback: PlaybackFactory.sample({
      duration: dayjs.duration({ minutes: 1, seconds: 10 }),
    }),
  }),
  playlistId = '123',
  apiClient: FakeBoclipsClient = new FakeBoclipsClient(),
  queryClient: QueryClient = new QueryClient(),
) => {
  apiClient.users.insertCurrentUser(
    UserFactory.sample({
      id: 'user-1',
    }),
  );

  return render(
    <main tabIndex={-1}>
      <QueryClientProvider client={queryClient}>
        <BoclipsClientProvider client={apiClient}>
          <PlaylistVideoBookmarkButton video={video} playlistId={playlistId} />
        </BoclipsClientProvider>
      </QueryClientProvider>
      <ToastContainer />
    </main>,
  );
};

const openShareModal = async (wrapper: RenderResult) => {
  const button = await wrapper.findByRole('button', { name: 'Bookmark' });
  await userEvent.click(button);
};
