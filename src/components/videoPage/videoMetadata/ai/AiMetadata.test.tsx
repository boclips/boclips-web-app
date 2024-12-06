import React from 'react';
import { render } from '@testing-library/react';
import AiMetadata from '@components/videoPage/videoMetadata/ai/AiMetadata';
import { VideoAIMetadata } from '@components/videoPage/videoMetadata/types/VideoAIMetadata';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VideoAiMetadata from '@components/videoPage/videoMetadata/ai/VideoAiMetadata';

describe('AiMetadata', () => {
  it('displays only the spinner when videoAIMetadata are loading', async () => {
    const wrapper = render(
      <AiMetadata
        isLoading
        metadata={['Some metadata']}
        type={VideoAIMetadata.LEARNING_OUTCOMES}
      />,
    );

    expect(
      wrapper.getByTestId('video-ai-metadata-loading-spinner'),
    ).toBeVisible();
    expect(wrapper.queryByText('AI generated')).toBeNull();
    expect(wrapper.queryByText('Some metadata')).toBeNull();
  });

  it('displays the metadata and AI generated badge when not loading', async () => {
    const wrapper = render(
      <AiMetadata
        isLoading={false}
        metadata={['Some metadata']}
        type={VideoAIMetadata.LEARNING_OUTCOMES}
      />,
    );

    expect(wrapper.getByText('AI generated')).toBeVisible();
    expect(wrapper.getByText('Some metadata')).toBeVisible();
    expect(
      wrapper.queryByTestId('video-ai-metadata-loading-spinner'),
    ).toBeNull();
  });

  it('can display multiple metadata items', async () => {
    const wrapper = render(
      <AiMetadata
        isLoading={false}
        metadata={['Some metadata', 'Some other metadata']}
        type={VideoAIMetadata.LEARNING_OUTCOMES}
      />,
    );

    expect(wrapper.getByText('Some metadata')).toBeVisible();
    expect(wrapper.getByText('Some other metadata')).toBeVisible();
  });

  it('displays an informative message when no metadata loaded', async () => {
    const wrapper = render(
      <>
        <AiMetadata
          isLoading={false}
          metadata={undefined}
          type={VideoAIMetadata.LEARNING_OUTCOMES}
        />
        <AiMetadata
          isLoading={false}
          metadata={undefined}
          type={VideoAIMetadata.ASSESSMENT_QUESTIONS}
        />
      </>,
    );

    expect(wrapper.getAllByText('AI generated')).toHaveLength(2);
    expect(
      wrapper.getByText(
        'There are no Learning Outcomes available for this video yet.',
      ),
    ).toBeVisible();
    expect(
      wrapper.getByText(
        'There are no Assessment Questions available for this video yet.',
      ),
    ).toBeVisible();
    expect(
      wrapper.queryByTestId('video-ai-metadata-loading-spinner'),
    ).toBeNull();
  });

  it(`doesn't render video description section if description is blank`, () => {
    const video = VideoFactory.sample({ description: '' });

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoAiMetadata video={video} />
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
          <VideoAiMetadata video={video} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Video Description')).toBeNull();
  });
});
