import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { Link, Video } from 'boclips-api-client/dist/types';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import PlaylistVideoCardButtons from 'src/components/videoCard/buttons/PlaylistVideoCardButtons';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

describe('Playlist Video Card Buttons', () => {
  it('transcript button present', async () => {
    const video = VideoFactory.sample({
      links: {
        self: new Link({ href: 'fake-link' }),
        logInteraction: new Link({ href: 'fake-link' }),
        transcript: new Link({ href: 'fake-link' }),
      },
    });
    const collection = CollectionFactory.sample({
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id },
          video: VideoFactory.sample({ id: video.id }),
        }),
      ],
      id: '123',
    });

    const fakeClient = new FakeBoclipsClient();

    fakeClient.collections.addToFake(collection);
    fakeClient.videos.insertVideo(video);
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          createdAt: new Date(),
        },
      }),
    );

    const wrapper = renderPlaylistVideoCardButtons(
      fakeClient,
      video,
      collection.id,
    );

    expect(await wrapper.findByLabelText('download-transcript')).toBeVisible();
  });
  it('playlists button present', async () => {
    const video = VideoFactory.sample({
      links: {
        self: new Link({ href: 'fake-link' }),
        logInteraction: new Link({ href: 'fake-link' }),
        transcript: new Link({ href: 'fake-link' }),
      },
    });
    const collection = CollectionFactory.sample({
      id: '123',
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id },
          video: VideoFactory.sample({ id: video.id }),
        }),
      ],
    });
    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.addToFake(collection);
    fakeClient.videos.insertVideo(video);
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          createdAt: new Date(),
        },
      }),
    );

    const wrapper = renderPlaylistVideoCardButtons(
      fakeClient,
      video,
      collection.id,
    );

    expect(await wrapper.findByLabelText('Add to playlist')).toBeVisible();
  });
  it('transcript button hidden when video has no transcript', async () => {
    const video = VideoFactory.sample({
      links: {
        self: new Link({ href: 'fake-link' }),
        logInteraction: new Link({ href: 'fake-link' }),
      },
    });
    const collection = CollectionFactory.sample({
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id },
          video: VideoFactory.sample({ id: video.id }),
        }),
      ],
      id: '123',
    });

    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.addToFake(collection);
    fakeClient.videos.insertVideo(video);

    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          createdAt: new Date(),
        },
      }),
    );

    const wrapper = renderPlaylistVideoCardButtons(
      fakeClient,
      video,
      collection.id,
    );

    expect(
      wrapper.queryByLabelText('download-transcript'),
    ).not.toBeInTheDocument();
  });
  it('should display bookmark button', async () => {
    const video = VideoFactory.sample({});
    const collection = CollectionFactory.sample({
      assets: [
        CollectionAssetFactory.sample({
          id: { videoId: video.id },
          video: VideoFactory.sample({ id: video.id }),
        }),
      ],
      id: '123',
    });

    const fakeClient = new FakeBoclipsClient();
    fakeClient.collections.addToFake(collection);
    fakeClient.videos.insertVideo(video);

    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          createdAt: new Date(),
        },
      }),
    );

    const wrapper = renderPlaylistVideoCardButtons(
      fakeClient,
      video,
      collection.id,
    );

    expect(await wrapper.findByText('Bookmark')).toBeInTheDocument();
  });

  const renderPlaylistVideoCardButtons = (
    fakeClient: FakeBoclipsClient,
    video: Video,
    playlistId: string,
  ) => {
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={new QueryClient()}>
          <PlaylistVideoCardButtons video={video} playlistId={playlistId} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );
  };
});
