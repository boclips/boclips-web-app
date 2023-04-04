import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { render } from '@testing-library/react';
import React from 'react';
import { FeaturedPlaylists } from 'src/components/playlists/FeaturedPlaylists';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

describe(`PromotedPlaylists`, () => {
  it(`renders all promoted playlists`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promoted: true,
        title: 'my promoted playlist',
      }),
    );
    fakeApiClient.collections.addToFake(
      CollectionFactory.sample({
        promoted: false,
        title: 'my regular playlist',
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

    expect(wrapper.getByText('Promoted Playlists')).toBeInTheDocument();
    expect(
      await wrapper.findByText('my promoted playlist'),
    ).toBeInTheDocument();
    expect(wrapper.queryByText('my regular playlist')).not.toBeInTheDocument();
  });
});
