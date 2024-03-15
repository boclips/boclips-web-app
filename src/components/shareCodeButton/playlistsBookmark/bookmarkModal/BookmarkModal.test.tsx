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
import PlaylistVideoBookmarkButton from 'src/components/shareCodeButton/playlistsBookmark/PlaylistVideoBookmarkButton';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

describe('Bookmark modal for playlists', () => {
  it(`allows setting start and end time for video`, async () => {
    const video = VideoFactory.sample({ id: 'video-id' });
    const collection = CollectionFactory.sample({
      videos: [VideoFactory.sample({ id: video.id })],
      id: '123',
    });

    const apiClient = new FakeBoclipsClient();

    apiClient.videos.insertVideo(video);
    apiClient.collections.addToFake(collection);

    const wrapper = renderBookmarkButton(video, collection.id, apiClient);
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

    const updatedPlaylist = await apiClient.collections.get(collection.id);

    await waitFor(() => {
      expect(updatedPlaylist.segments[video.id].start).toEqual(32);
      expect(updatedPlaylist.segments[video.id].end).toEqual(55);
      expect(
        wrapper.getByText('Video bookmark has been updated'),
      ).toBeInTheDocument();
    });
  });

  it(`allows removing start and end time for video`, async () => {
    const video = VideoFactory.sample({ id: '123' });
    const collection = CollectionFactory.sample({
      videos: [VideoFactory.sample({ id: video.id })],
      id: '123',
      segments: {
        [video.id]: {
          start: 1,
          end: 10,
        },
      },
    });

    const apiClient = new FakeBoclipsClient();

    apiClient.videos.insertVideo(video);
    apiClient.collections.addToFake(collection);

    const wrapper = renderBookmarkButton(video, '123', apiClient);

    await openShareModal(wrapper);

    const endCheckbox = wrapper.getByRole('checkbox', {
      name: 'End time enabled',
    });

    const startCheckbox = wrapper.getByRole('checkbox', {
      name: 'Start time enabled',
    });
    const startTimeInput = wrapper.getByLabelText('Start time:');
    const endTimeInput = wrapper.getByLabelText('End time:');

    expect(endCheckbox).toBeChecked();
    expect(startCheckbox).toBeChecked();
    expect(startTimeInput).not.toBeDisabled();
    expect(endTimeInput).not.toBeDisabled();

    await userEvent.click(startCheckbox);
    await userEvent.click(endCheckbox);

    expect(endCheckbox).not.toBeChecked();
    expect(startCheckbox).not.toBeChecked();

    await userEvent.click(wrapper.getByText('Set'));

    const updatedPlaylist = await apiClient.collections.get(collection.id);

    await waitFor(() => {
      expect(updatedPlaylist.segments[video.id]).toEqual(undefined);
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

  it('displays an error message if updating the bookmark fails', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const collection = CollectionFactory.sample({
      videos: [VideoFactory.sample({ id: video.id })],
      id: '123',
    });

    const apiClient = new FakeBoclipsClient();
    apiClient.collections.addToFake(collection);

    apiClient.collections.safeUpdate = jest
      .fn()
      .mockRejectedValue(new Error('Network Error'));

    const wrapper = renderBookmarkButton(video, '123', apiClient);
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
