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
    const fakeApiCient = new FakeBoclipsClient();
    fakeApiCient.videos.insertVideo(
      VideoFactory.sample({ id: '5e145c0ebc67ab520cac9e91', title: 'video 1' }),
    );
    fakeApiCient.videos.insertVideo(
      VideoFactory.sample({ id: '5c54d813d8eafeecae2114da', title: 'video 2' }),
    );
    fakeApiCient.videos.insertVideo(
      VideoFactory.sample({ id: '5c54d80bd8eafeecae210fc7', title: 'video 3' }),
    );
    fakeApiCient.videos.insertVideo(
      VideoFactory.sample({ id: '5d3055dde69e6810ae1141b3', title: 'video 4' }),
    );
    const history = createBrowserHistory();

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeApiCient}>
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
