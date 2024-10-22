import ReorderModal from 'src/components/playlistModal/reorder/ReorderPlaylistModal';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { lastEvent } from 'src/testSupport/lastEvent';

describe('Reorder modal', () => {
  const client = new FakeBoclipsClient();

  it('displays title, subtitle', () => {
    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <ReorderModal
            confirmButtonText="Update"
            onCancel={jest.fn()}
            playlist={CollectionFactory.sample({
              mine: true,
            })}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Reorder videos')).toBeVisible();
    expect(
      wrapper.getByText(
        'Drag & drop video titles to put them in your desired order:',
      ),
    ).toBeVisible();
  });

  it('displays videos list with additional info', () => {
    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <ReorderModal
            confirmButtonText="Update"
            onCancel={jest.fn()}
            playlist={CollectionFactory.sample({
              assets: [
                CollectionAssetFactory.sample({
                  video: VideoFactory.sample({
                    title: 'video-1',
                    bestFor: [{ label: 'bestForTag' }],
                    createdBy: 'By your aunt',
                  }),
                }),
              ],
              mine: true,
            })}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('video-1')).toBeVisible();
    expect(wrapper.getByText('bestForTag')).toBeVisible();
    expect(wrapper.getByText('By your aunt')).toBeVisible();
  });

  it('emits event when playlist is reordered', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <ReorderModal
            confirmButtonText="Update"
            onCancel={jest.fn()}
            playlist={CollectionFactory.sample({
              mine: true,
            })}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Reorder videos')).toBeVisible();
    const updateButton = wrapper.getByRole('button', { name: 'Update' });

    expect(updateButton).toBeVisible();
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(lastEvent(client, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'PLAYLIST_REORDERED',
        anonymous: false,
      });
    });
  });
});
