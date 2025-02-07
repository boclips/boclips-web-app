import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import dayjs from 'src/day-js';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { ToastContainer } from 'react-toastify';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { lastEvent } from 'src/testSupport/lastEvent';
import PlaylistAssetNoteButton from 'src/components/playlists/buttons/playlistNote/PlaylistAssetNoteButton';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';

describe('Note modal for playlists', () => {
  const videoAsset = CollectionAssetFactory.sample({
    id: { videoId: 'video-id', highlightId: null },
    video: VideoFactory.sample({ id: 'video-id' }),
  });
  const highlightAsset = CollectionAssetFactory.sample({
    id: { videoId: 'video-id', highlightId: 'highlight-id' },
    video: VideoFactory.sample({ id: 'video-id' }),
  });
  const collectionWithoutNoteId = 'without-note';
  const collectionWithNoteId = 'with-note';
  const apiClient = new FakeBoclipsClient();

  beforeEach(() => {
    apiClient.videos.clear();
    apiClient.collections.clear();

    apiClient.videos.insertVideo(videoAsset.video);
    apiClient.collections.addToFake(
      CollectionFactory.sample({
        id: collectionWithoutNoteId,
        assets: [videoAsset, highlightAsset],
      }),
    );
    apiClient.collections.addToFake(
      CollectionFactory.sample({
        id: collectionWithNoteId,
        assets: [{ ...videoAsset, note: 'A regular note' }],
      }),
    );
  });

  it(`allows setting a note on a video`, async () => {
    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithoutNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Add note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    const noteInput = wrapper.getByPlaceholderText('Add note');
    expect(noteInput).toBeVisible();

    await userEvent.type(
      noteInput,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Set note' }));

    const updatedPlaylist = await apiClient.collections.get(
      collectionWithoutNoteId,
    );

    const updatedNote = updatedPlaylist.assets.find(
      (updatedAsset) =>
        updatedAsset.id.videoId === videoAsset.id.videoId &&
        updatedAsset.id.highlightId === videoAsset.id.highlightId,
    ).note;

    expect(updatedNote).toEqual(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    await waitFor(() => {
      expect(
        wrapper.getByText('Video note has been updated'),
      ).toBeInTheDocument();
    });
  });

  it(`allows setting a note on a video highlight`, async () => {
    const wrapper = renderNoteButton(
      highlightAsset,
      collectionWithoutNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Add note for '${highlightAsset.video.title}'`),
    ).toBeVisible();

    const noteInput = wrapper.getByPlaceholderText('Add note');
    expect(noteInput).toBeVisible();

    await userEvent.type(
      noteInput,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Set note' }));

    const updatedPlaylist = await apiClient.collections.get(
      collectionWithoutNoteId,
    );

    const updatedNote = updatedPlaylist.assets.find(
      (updatedAsset) =>
        updatedAsset.id.videoId === highlightAsset.id.videoId &&
        updatedAsset.id.highlightId === highlightAsset.id.highlightId,
    ).note;

    expect(updatedNote).toEqual(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    await waitFor(() => {
      expect(
        wrapper.getByText('Video note has been updated'),
      ).toBeInTheDocument();
    });
  });

  it(`allows removing the note for a video`, async () => {
    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithNoteId,
      apiClient,
    );

    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Update note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    const noteInput = wrapper.getByPlaceholderText('Add note');
    expect(noteInput).toBeVisible();

    await userEvent.clear(noteInput);

    await userEvent.click(wrapper.getByRole('button', { name: 'Set note' }));

    const updatedPlaylist = await apiClient.collections.get(
      collectionWithNoteId,
    );

    const updatedNote = updatedPlaylist.assets.find(
      (updatedAsset) =>
        updatedAsset.id.videoId === videoAsset.id.videoId &&
        updatedAsset.id.highlightId === videoAsset.id.highlightId,
    ).note;

    expect(updatedNote).toEqual('');

    await waitFor(() => {
      expect(
        wrapper.getByText('Video note has been updated'),
      ).toBeInTheDocument();
    });
  });

  it(`sends a platform interaction event when set note modal is opened`, async () => {
    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithoutNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Add note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'SET_NOTE_MODAL_OPENED',
        anonymous: false,
      });
    });
  });

  it(`sends a platform interaction event when update note modal is opened`, async () => {
    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Update note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'UPDATE_NOTE_MODAL_OPENED',
        anonymous: false,
      });
    });
  });

  it(`sends a platform interaction event when note is set`, async () => {
    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithoutNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Add note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    const noteInput = wrapper.getByPlaceholderText('Add note');
    expect(noteInput).toBeVisible();

    await userEvent.type(
      noteInput,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Set note' }));

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'SET_NOTE_MODAL_SUBMITTED',
        anonymous: false,
      });
    });
  });

  it(`sends a platform interaction event when bookmark is updated`, async () => {
    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Update note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    const noteInput = wrapper.getByPlaceholderText('Add note');
    expect(noteInput).toBeVisible();

    await userEvent.clear(noteInput);

    await userEvent.click(wrapper.getByRole('button', { name: 'Set note' }));

    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'UPDATE_NOTE_MODAL_SUBMITTED',
        anonymous: false,
      });
    });
  });

  it('removes the tabIndex on main element, to allow copying the text', async () => {
    const wrapper = renderNoteButton();

    expect(wrapper.getByRole('main')).toHaveAttribute('tabIndex', '-1');

    await openNoteModal(wrapper);

    await waitFor(() =>
      expect(wrapper.getByRole('main')).not.toHaveAttribute('tabIndex'),
    );
  });

  it('displays an error message if updating the bookmark fails', async () => {
    apiClient.collections.safeUpdate = jest
      .fn()
      .mockRejectedValue(new Error('Network Error'));

    const wrapper = renderNoteButton(
      videoAsset,
      collectionWithoutNoteId,
      apiClient,
    );
    await openNoteModal(wrapper);

    expect(
      await wrapper.findByText(`Add note for '${videoAsset.video.title}'`),
    ).toBeVisible();

    const noteInput = wrapper.getByPlaceholderText('Add note');
    expect(noteInput).toBeVisible();

    await userEvent.type(
      noteInput,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Set note' }));

    await waitFor(() => {
      expect(
        wrapper.getByText('An error occurred, please try again'),
      ).toBeInTheDocument();
    });
  });
});

const renderNoteButton = (
  asset: CollectionAsset = CollectionAssetFactory.sample({
    video: VideoFactory.sample({
      id: 'video-1',
      title: 'Tractor Video',
      playback: PlaybackFactory.sample({
        duration: dayjs.duration({ minutes: 1, seconds: 10 }),
      }),
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
          <PlaylistAssetNoteButton
            selectedAsset={asset}
            playlistId={playlistId}
          />
        </BoclipsClientProvider>
      </QueryClientProvider>
      <ToastContainer />
    </main>,
  );
};

const openNoteModal = async (wrapper: RenderResult) => {
  const button = await wrapper.findByRole('button', { name: 'Note' });
  await userEvent.click(button);
};
