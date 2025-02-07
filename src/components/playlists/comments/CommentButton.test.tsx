import { render, waitFor, within } from '@testing-library/react';
import CommentButton from 'src/components/playlists/comments/CommentButton';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import userEvent from '@testing-library/user-event';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { CollectionPermission } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionPermissions';

describe('comment button', () => {
  it('displays a comment button', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <CommentButton
              videoId={video.id}
              collection={CollectionFactory.sample({
                id: '1',
                mine: true,
                owner: user.id,
              })}
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );
  });

  it('displays number of comments on a video', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);

    const collection = CollectionFactory.sample({
      id: 'collection-id',
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id, highlightId: null },
          comments: [
            {
              id: 'id-123',
              userId: user.id,
              name: 'remy o',
              email: 'remy@boclips.com',
              text: 'this is a comment',
              createdAt: Date.now().toString(),
            },
            {
              id: 'id-1234',
              userId: user.id,
              name: 'remy o',
              email: 'remy@boclips.com',
              text: 'this is a comment',
              createdAt: Date.now().toString(),
            },
          ],
        }),
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons
              video={video}
              iconOnly
              additionalSecondaryButtons={
                <CommentButton videoId={video.id} collection={collection} />
              }
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );

    expect(
      within(wrapper.getByTestId('add-comment-button')).getByText(2),
    ).toBeInTheDocument();
  });

  it('displays all elements in slider', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);
    const collection = CollectionFactory.sample({
      id: 'collection-id',
      mine: true,
      owner: user.id,
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id, highlightId: null },
          comments: [
            {
              id: 'id-1234',
              userId: user.id,
              name: 'remy o',
              email: 'remy@boclips.com',
              text: 'this is a comment',
              createdAt: '2023-01-11 15:46',
            },
          ],
        }),
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons
              video={video}
              iconOnly
              additionalSecondaryButtons={
                <CommentButton videoId={video.id} collection={collection} />
              }
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );

    await userEvent.click(wrapper.getByTestId('add-comment-button'));

    const slider = wrapper.getByTestId(`slider-panel-${video.id}`);

    expect(within(slider).getByText('Comments')).toBeInTheDocument();
    expect(
      within(slider).getByPlaceholderText('Add a comment'),
    ).toBeInTheDocument();
    expect(within(slider).getByText('remy o')).toBeInTheDocument();
    expect(within(slider).getByText('this is a comment')).toBeInTheDocument();
    expect(within(slider).getByText('2023-01-11 15:46')).toBeInTheDocument();
  });

  it('can add comment to a video', async () => {
    const video = VideoFactory.sample({ id: '123' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);
    const collection = CollectionFactory.sample({
      id: 'collection-id',
      mine: true,
      owner: user.id,
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id, highlightId: null },
          comments: null,
        }),
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons
              video={video}
              iconOnly
              additionalSecondaryButtons={
                <CommentButton videoId={video.id} collection={collection} />
              }
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );

    await userEvent.click(wrapper.getByTestId('add-comment-button'));

    const slider = wrapper.getByTestId(`slider-panel-${video.id}`);

    expect(await within(slider).queryByText('Reply')).not.toBeInTheDocument();

    await userEvent.type(
      within(slider).getByPlaceholderText('Add a comment'),
      'this is a comment',
    );

    expect(await within(slider).queryByText('Reply')).toBeInTheDocument();

    await userEvent.click(within(slider).getByText('Reply'));

    await waitFor(() => {
      expect(within(slider).getByText('this is a comment')).toBeInTheDocument();
    });
  });

  it('can open and close slider', async () => {
    const video = VideoFactory.sample({ id: '123', title: 'title' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);
    const collection = CollectionFactory.sample({
      id: 'collection-id',
      mine: true,
      owner: user.id,
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id, highlightId: null },
          video,
          comments: [
            {
              id: 'id-1234',
              userId: user.id,
              name: 'remy o',
              email: 'remy@boclips.com',
              text: 'this is a comment',
              createdAt: '2023-01-04 14:46',
            },
          ],
        }),
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons
              video={video}
              iconOnly
              additionalSecondaryButtons={
                <CommentButton videoId={video.id} collection={collection} />
              }
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );

    await userEvent.click(wrapper.getByTestId('add-comment-button'));

    expect(wrapper.getByTestId(`slider-panel-${video.id}`)).toBeInTheDocument();

    await userEvent.click(wrapper.getByTestId('close-button'));

    expect(
      wrapper.queryByTestId(`slider-panel-${video.id}`),
    ).not.toBeInTheDocument();
  });

  it('removes text input value when slider is closed', async () => {
    const video = VideoFactory.sample({ id: '123', title: 'title' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);
    const collection = CollectionFactory.sample({
      id: 'collection-id',
      mine: true,
      owner: user.id,
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id, highlightId: null },
          comments: null,
        }),
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons
              video={video}
              iconOnly
              additionalSecondaryButtons={
                <CommentButton videoId={video.id} collection={collection} />
              }
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );

    await userEvent.click(wrapper.getByTestId('add-comment-button'));

    await waitFor(() => wrapper.getByTestId(`slider-panel-${video.id}`)).then(
      async (it) => {
        await userEvent.type(
          within(it).getByPlaceholderText('Add a comment'),
          'this is a comment',
        );
      },
    );

    expect(wrapper.queryByText('this is a comment')).toBeInTheDocument();

    await userEvent.click(wrapper.getByTestId('close-button'));

    await userEvent.click(wrapper.getByTestId('add-comment-button'));

    expect(wrapper.queryByText('this is a comment')).not.toBeInTheDocument();
  });

  it('displays the comment button if playlist has EDIT permission', async () => {
    const video = VideoFactory.sample({ id: '123', title: 'title' });
    const client = new FakeBoclipsClient();
    const user = UserFactory.sample();
    const user2 = UserFactory.sample();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION: true,
    });
    client.collections.setCurrentUser(user.id);
    const collection = CollectionFactory.sample({
      title: '',
      id: 'collection-id',
      mine: false,
      owner: user2.id,
      permissions: {
        anyone: CollectionPermission.EDIT,
      },
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id, highlightId: null },
          comments: null,
        }),
      ],
    });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoCardButtons
              video={video}
              iconOnly
              additionalSecondaryButtons={
                <CommentButton videoId={video.id} collection={collection} />
              }
            />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() =>
      expect(wrapper.getByTestId('add-comment-button')).toBeInTheDocument(),
    );

    await userEvent.click(wrapper.getByTestId('add-comment-button'));

    await waitFor(() => wrapper.getByTestId(`slider-panel-${video.id}`)).then(
      async (it) => {
        await userEvent.type(
          within(it).getByPlaceholderText('Add a comment'),
          'this is a comment',
        );
      },
    );

    await userEvent.click(
      within(wrapper.getByTestId(`slider-panel-${video.id}`)).getByText(
        'Reply',
      ),
    );

    expect(wrapper.queryByText('this is a comment')).toBeInTheDocument();
  });
});
