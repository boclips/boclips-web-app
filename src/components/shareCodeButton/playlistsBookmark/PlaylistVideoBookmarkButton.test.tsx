import { render, RenderResult, waitFor } from '@testing-library/react';
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

describe('Bookmark button component', () => {
  it('displays Bookmark bookmark', () => {
    const wrapper = renderBookmarkButton();

    expect(wrapper.getByText('Bookmark')).toBeInTheDocument();
  });

  it('displays Edit Bookmark bookmark', async () => {
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

    expect(await wrapper.findByText('Edit Bookmark')).toBeInTheDocument();
  });

  it('displays playlist bookmark modal on click', async () => {
    const wrapper = renderBookmarkButton();
    await openShareModal(wrapper);

    expect(wrapper.getByRole('dialog')).toBeInTheDocument();
    expect(
      wrapper.getByText('Bookmark custom timings for this video'),
    ).toBeVisible();

    const body = wrapper.getByTestId('share-code-body');
    expect(body).toBeVisible();
    expect(body.textContent).toEqual(
      'Set custom start and end times to bookmark a specific section of the video for students to focus on.',
    );
  });

  it('removes the tabIndex on main element, to allow copying the text', async () => {
    const wrapper = renderBookmarkButton();

    expect(wrapper.getByRole('main')).toHaveAttribute('tabIndex', '-1');

    openShareModal(wrapper);

    await waitFor(() =>
      expect(wrapper.getByRole('main')).not.toHaveAttribute('tabIndex'),
    );
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
