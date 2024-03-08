import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { render } from '@testing-library/react';
import React from 'react';
import FeaturedPlaylists from 'src/components/featuredPlaylists/FeaturedPlaylists';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PromotedForProduct } from 'boclips-api-client/dist/sub-clients/collections/model/PromotedForCollectionFilter';

describe(`PromotedPlaylists`, () => {
  it(`renders all playlists promoted for product`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.LIBRARY, PromotedForProduct.TEACHERS],
        title: 'my promoted for library and teachers playlist',
        videos: [VideoFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.TEACHERS],
        title: 'my promoted for teachers playlist',
        videos: [VideoFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [],
        title: 'my regular playlist',
        videos: [VideoFactory.sample({})],
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={fakeApiClient}>
        <Router>
          <QueryClientProvider client={new QueryClient()}>
            <FeaturedPlaylists product="LIBRARY" />
          </QueryClientProvider>
        </Router>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Featured Playlists')).toBeInTheDocument();
    expect(
      await wrapper.findByText('my promoted for library and teachers playlist'),
    ).toBeInTheDocument();
    expect(
      wrapper.queryByText('my promoted for teachers playlist'),
    ).not.toBeInTheDocument();
    expect(wrapper.queryByText('my regular playlist')).not.toBeInTheDocument();
  });

  it(`does not render a playlist with no videos`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.CLASSROOM],
        title: 'my promoted playlist with videos',
        videos: [VideoFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.CLASSROOM],
        title: 'my promoted empty playlist',
        videos: [],
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={fakeApiClient}>
        <Router>
          <QueryClientProvider client={new QueryClient()}>
            <FeaturedPlaylists product="CLASSROOM" />
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
