import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { render } from '@testing-library/react';
import React from 'react';
import { FeaturedPlaylists } from 'src/components/featuredPlaylists/FeaturedPlaylists';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe(`PromotedPlaylists`, () => {
  it(`renders all promoted playlists`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promoted: true,
        title: 'my promoted playlist',
        videos: [VideoFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promoted: false,
        title: 'my regular playlist',
        videos: [VideoFactory.sample({})],
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={fakeApiClient}>
        <Router>
          <QueryClientProvider client={new QueryClient()}>
            <FeaturedPlaylists />
          </QueryClientProvider>
        </Router>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Featured Playlists')).toBeInTheDocument();
    expect(
      await wrapper.findByText('my promoted playlist'),
    ).toBeInTheDocument();
    expect(wrapper.queryByText('my regular playlist')).not.toBeInTheDocument();
  });

  it(`does not render a playlist with no videos`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promoted: true,
        title: 'my promoted playlist with videos',
        videos: [VideoFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promoted: true,
        title: 'my promoted empty playlist',
        videos: [],
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={fakeApiClient}>
        <Router>
          <QueryClientProvider client={new QueryClient()}>
            <FeaturedPlaylists />
          </QueryClientProvider>
        </Router>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Featured Playlists')).toBeInTheDocument();
    expect(
      await wrapper.findByText('my promoted playlist with videos'),
    ).toBeInTheDocument();
    expect(
      wrapper.queryByText('my promoted empty playlist'),
    ).not.toBeInTheDocument();
  });
});
