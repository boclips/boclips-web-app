import { render } from '@testing-library/react';
import React from 'react';
import { VideoDescriptionAndAIMetadataWrapper } from 'src/components/videoPage/videoAIMetadata/VideoDescriptionAndAIMetadataWrapper';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('VideoDescriptionAndAIMetadataWrapper', () => {
  it(`renders video description section if description is provided`, () => {
    const video = VideoFactory.sample({ description: 'Very detailed, wow!' });

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoDescriptionAndAIMetadataWrapper video={video} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Video Description')).toBeVisible();
  });

  it(`doesn't render video description section if description is blank`, () => {
    const video = VideoFactory.sample({ description: '' });

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoDescriptionAndAIMetadataWrapper video={video} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Video Description')).toBeNull();
  });

  it(`doesn't render video description section if description is whitespace`, () => {
    const video = VideoFactory.sample({ description: '   ' });

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoDescriptionAndAIMetadataWrapper video={video} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Video Description')).toBeNull();
  });
});
