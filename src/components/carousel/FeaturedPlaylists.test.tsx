import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { render } from '@testing-library/react';
import React from 'react';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { PromotedForProduct } from 'boclips-api-client/dist/sub-clients/collections/model/PromotedForProduct';
import FeaturedPlaylists from '@src/components/carousel/FeaturedPlaylists';

describe(`PromotedPlaylists`, () => {
  it(`renders all playlists promoted for product`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.LIBRARY, PromotedForProduct.CLASSROOM],
        title: 'my promoted for library and classroom playlist',
        assets: [CollectionAssetFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.CLASSROOM],
        title: 'my promoted for classroom playlist',
        assets: [CollectionAssetFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [],
        title: 'my regular playlist',
        assets: [CollectionAssetFactory.sample({})],
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
      await wrapper.findByText(
        'my promoted for library and classroom playlist',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.queryByText('my promoted for classroom playlist'),
    ).not.toBeInTheDocument();
    expect(wrapper.queryByText('my regular playlist')).not.toBeInTheDocument();
  });

  it(`does not render a playlist with no videos`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.CLASSROOM],
        title: 'my promoted playlist with videos',
        assets: [CollectionAssetFactory.sample({})],
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promotedFor: [PromotedForProduct.CLASSROOM],
        title: 'my promoted empty playlist',
        assets: [],
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
