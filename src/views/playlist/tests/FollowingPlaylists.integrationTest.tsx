import { FollowPlaylist } from '@src/services/followPlaylist';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { render, waitFor } from '@testing-library/react';
import { BoclipsSecurityProvider } from '@components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router, Routes } from 'react-router-dom';
import PlaylistView from '@src/views/playlist/PlaylistView';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { CollectionFactory as collectionFactory } from '@src/testSupport/CollectionFactory';
import App from '@src/App';
import { Link } from 'boclips-api-client/dist/types';
import { sleep } from '@src/testSupport/sleep';
import React from 'react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { createAssetWithThumbnail } from '@src/testSupport/createAssetWithTumbnail';

describe('following a playlist', () => {
  let client = null;

  const assets = [
    createAssetWithThumbnail('111', 'Video One'),
    createAssetWithThumbnail('222', 'Video Two'),
    createAssetWithThumbnail('333', 'Video Three'),
    createAssetWithThumbnail('444', 'Video Four'),
    createAssetWithThumbnail('555', 'Video Five'),
  ];

  const playlist = CollectionFactory.sample({
    id: '123',
    title: 'Hello there',
    description: 'Very nice description',
    assets,
    owner: 'myuserid',
    mine: true,
  });

  beforeEach(() => {
    client = new FakeBoclipsClient();
    assets.forEach((it) => client.videos.insertVideo(it.video));
    client.collections.setCurrentUser('myuserid');
    client.users.insertCurrentUser(
      UserFactory.sample({
        id: 'myuserid',
      }),
    );
    client.collections.addToFake(playlist);
  });

  beforeEach(() => {
    client.collections.clear();
  });

  it(`invokes bookmark command when playlist is opened`, async () => {
    client.collections.addToFake(playlist);

    const bookmarkService = new FollowPlaylist(client.collections);
    const bookmarkFunction = jest.spyOn(bookmarkService, 'follow');
    const history = createMemoryHistory();

    history.push('/playlists/123');

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <QueryClientProvider client={new QueryClient()}>
            <Router location={history.location} navigator={history}>
              <Routes>
                <Route
                  path="/playlists/:id"
                  element={<PlaylistView followPlaylist={bookmarkService} />}
                />
              </Routes>
            </Router>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    await waitFor(() => {
      expect(bookmarkFunction).toHaveBeenCalledWith(playlist);
    });
  });

  it(`shows toast notification when playlist is bookmarked`, async () => {
    const bookmarkablePlaylist = CollectionFactory.sample({
      id: '111',
      title: 'Hello test',
      description: 'Very nice description',
      assets,
      owner: 'myuserid',
      mine: false,
      links: collectionFactory.sampleLinks({}),
    });

    client.collections.addToFake(bookmarkablePlaylist);

    const history = createBrowserHistory();
    history.push('/playlists/111');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    expect(
      await wrapper.findByText("Playlist 'Hello test' has been created"),
    ).toBeVisible();
  });

  it(`does not display notification when playlist is already bookmarked`, async () => {
    const alreadyBookmarkedPlaylist = CollectionFactory.sample({
      id: '222',
      title: 'Hello test',
      description: 'Very nice description',
      assets,
      owner: 'myuserid',
      mine: false,
      links: collectionFactory.sampleLinks({
        bookmark: undefined,
        unbookmark: new Link({
          href: 'https://api.boclips.com/v1/collections/1?bookmarked=false',
        }),
      }),
    });

    client.collections.addToFake(alreadyBookmarkedPlaylist);

    const history = createBrowserHistory();
    history.push('/playlists/222');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    // Wait until the toast is (potentially) rendered
    await sleep(1000);

    expect(
      wrapper.queryByText("Playlist 'Hello test' has been created"),
    ).toBeNull();
  });
});
