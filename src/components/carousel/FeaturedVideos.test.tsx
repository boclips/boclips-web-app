import React from 'react';
import FeaturedVideos from '@src/components/carousel/FeaturedVideos';
import { render, screen } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { BoclipsSecurityProvider } from '@src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';

describe(`FeaturedVideos`, () => {
  const fakeApiClient = new FakeBoclipsClient();

  beforeEach(() => {
    fakeApiClient.clear();

    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '63fdfe8ad7fbb13615d23591',
        title: 'library video 1',
        createdBy: 'One-T',
      }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '60cb11f60560d046cde9d1e9',
        title: 'library video 2',
        createdBy: 'Nine-T',
      }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '627b417eef77c448ec160d95',
        title: 'library video 3',
        createdBy: 'Bull-T',
      }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '63c04899bf161a652f79f0ed',
        title: 'library video 4',
        createdBy: 'Me',
      }),
    );

    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '642963c7f2ff6f79b7a3deee',
        title: 'classroom video 1',
        createdBy: 'Reggie',
      }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '65e219d3acb34d232a464c4f',
        title: 'classroom video 2',
        createdBy: 'Jay-Z',
      }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '62555fbb357dff6f7b1259bd',
        title: 'classroom video 3',
        createdBy: '2pac and Biggie',
      }),
    );
    fakeApiClient.videos.insertVideo(
      VideoFactory.sample({
        id: '65153855ec623442504c7fa2',
        title: 'classroom video 4',
        createdBy: 'André from OutKast',
      }),
    );
  });

  it(`should render title and 4 videos for Library user`, async () => {
    const history = createBrowserHistory();

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeApiClient}>
          <Router location="" navigator={history}>
            <QueryClientProvider client={new QueryClient()}>
              <FeaturedVideos product="LIBRARY" />
            </QueryClientProvider>
          </Router>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(await screen.findByText('Featured Videos')).toBeVisible();
    expect(await screen.findByText('library video 1')).toBeVisible();
    expect(await screen.findByText('One-T')).toBeVisible();
    expect(await screen.findByText('library video 2')).toBeVisible();
    expect(await screen.findByText('Nine-T')).toBeVisible();
    expect(await screen.findByText('library video 3')).toBeVisible();
    expect(await screen.findByText('Bull-T')).toBeVisible();
    expect(await screen.findByText('library video 4')).toBeVisible();
    expect(await screen.findByText('Me')).toBeVisible();
  });

  it(`should render title and 4 videos for Classroom user`, async () => {
    const history = createBrowserHistory();

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeApiClient}>
          <Router location="" navigator={history}>
            <QueryClientProvider client={new QueryClient()}>
              <FeaturedVideos product="CLASSROOM" />
            </QueryClientProvider>
          </Router>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(await screen.findByText('Featured Videos')).toBeVisible();
    expect(await screen.findByText('classroom video 1')).toBeVisible();
    expect(await screen.findByText('Reggie')).toBeVisible();
    expect(await screen.findByText('classroom video 2')).toBeVisible();
    expect(await screen.findByText('Jay-Z')).toBeVisible();
    expect(await screen.findByText('classroom video 3')).toBeVisible();
    expect(await screen.findByText('2pac and Biggie')).toBeVisible();
    expect(await screen.findByText('classroom video 4')).toBeVisible();
    expect(await screen.findByText('André from OutKast')).toBeVisible();
  });
});
