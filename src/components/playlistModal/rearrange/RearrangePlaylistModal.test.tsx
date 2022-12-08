import RearrangeModal from 'src/components/playlistModal/rearrange/RearrangePlaylistModal';
import { render } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';

describe('Rearrange modal', () => {
  const client = new FakeBoclipsClient();

  beforeEach(() => {
    client.users.insertCurrentUser(
      UserFactory.sample({
        features: {
          BO_WEB_APP_REORDER_VIDEOS_IN_PLAYLIST: true,
        },
      }),
    );
  });
  afterEach(() => {
    client.users.clear();
  });

  it('displays title, subtitle', () => {
    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <RearrangeModal
            confirmButtonText="Update"
            onCancel={jest.fn()}
            playlist={CollectionFactory.sample({
              mine: true,
            })}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Rearrange videos')).toBeVisible();
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
          <RearrangeModal
            confirmButtonText="Update"
            onCancel={jest.fn()}
            playlist={CollectionFactory.sample({
              videos: [
                VideoFactory.sample({
                  title: 'video-1',
                  bestFor: [{ label: 'bestForTag' }],
                  createdBy: 'By your aunt',
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
});
