import { render, screen } from '@testing-library/react';

import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import VideoAiMetadata from '@src/components/videoPage/videoMetadata/ai/VideoAiMetadata';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('video AI metadata', () => {
  it(`renders learning outcomes when link present`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links.learningOutcomes = { href: 'outcomes' };

    const client = new QueryClient();
    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <VideoAiMetadata video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await screen.findByText('Learning Outcomes')).toBeVisible();
  });

  it(`hides learning outcomes when link missing`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links.learningOutcomes = null;

    const client = new QueryClient();
    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <VideoAiMetadata video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await screen.queryByText('Learning Outcomes')).toBeNull();
  });

  it(`renders assessment questions when link present`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links.assessmentQuestions = { href: 'questions' };

    const client = new QueryClient();
    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <VideoAiMetadata video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await screen.findByText('Learning Outcomes')).toBeVisible();
    expect(await screen.findByText('Assessment Questions')).toBeVisible();
  });

  it(`hides assessment questions when link missing`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links.assessmentQuestions = null;

    const client = new QueryClient();
    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <VideoAiMetadata video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await screen.queryByText('Assessment Questions')).toBeNull();
  });
});
