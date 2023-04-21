import React from 'react';
import { FeaturedVideos } from 'src/components/carousel/FeaturedVideos';
import { render, screen } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe(`FeaturedVideos`, () => {
  it(`should render title and 4 videos`, async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({ id: '63fdfe8ad7fbb13615d23591', title: 'video 1' }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({ id: '60cb11f60560d046cde9d1e9', title: 'video 2' }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({ id: '627b417eef77c448ec160d95', title: 'video 3' }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({ id: '63c04899bf161a652f79f0ed', title: 'video 4' }),
    );
    const history = createBrowserHistory();

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeApiClient}>
          <Router location="" navigator={history}>
            <QueryClientProvider client={new QueryClient()}>
              <FeaturedVideos />
            </QueryClientProvider>
          </Router>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(await screen.findByText('Featured Videos')).toBeVisible();
    expect(await screen.findByText('video 1')).toBeVisible();
    expect(await screen.findByText('video 2')).toBeVisible();
    expect(await screen.findByText('video 3')).toBeVisible();
    expect(await screen.findByText('video 4')).toBeVisible();
  });
});
