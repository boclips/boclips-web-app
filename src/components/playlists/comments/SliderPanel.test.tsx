import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { render, waitFor, within } from '@testing-library/react';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import SliderPanel from 'src/components/playlists/comments/SliderPanel';

describe('slider panel', () => {
  it('shows remove comment button to comment owner', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);

    const collection = CollectionFactory.sample({
      id: 'collection-id',
      comments: {
        videos: {
          [video.id]: [
            {
              id: 'id-123',
              userId: user.id,
              name: 'u ser',
              email: 'user@boclips.com',
              text: 'this is a user comment',
              createdAt: Date.now().toString(),
            },
          ],
        },
      },
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <SliderPanel
              closeSliderOnClick={null}
              videoId={video.id}
              collection={collection}
              comments={collection.comments.videos[video.id]}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('remove-comment-button')).toBeInTheDocument(),
    );
  });

  it('does not show remove comment button on non-owner comments', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.insertCurrentUser(user);
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);

    const collection = CollectionFactory.sample({
      id: 'collection-id',
      comments: {
        videos: {
          [video.id]: [
            {
              id: 'id-123',
              userId: user.id,
              name: 'u ser',
              email: 'user@boclips.com',
              text: 'this is a user comment',
              createdAt: Date.now().toString(),
            },
            {
              id: 'id-456',
              userId: 'another-user',
              name: 'another u ser',
              email: 'another@boclips.com',
              text: `this is a another user's comment comment`,
              createdAt: Date.now().toString(),
            },
          ],
        },
      },
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <SliderPanel
              closeSliderOnClick={null}
              videoId={video.id}
              collection={collection}
              comments={collection.comments.videos[video.id]}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const comment = wrapper.getByTestId('id-456');
    expect(within(comment).queryByTestId('remove-comment-button')).toBeNull();
  });
});
