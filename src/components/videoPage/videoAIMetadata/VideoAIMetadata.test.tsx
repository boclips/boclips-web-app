import React from 'react';
import { VideoAIMetadata } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadata';
import { VideoAIMetadataType } from 'src/components/videoPage/videoAIMetadata/VideoAIMetadataType';
import { render } from '@testing-library/react';

describe('VideoAIMetadata', () => {
  it('displays only the spinner when videoAIMetadata are loading', async () => {
    const wrapper = render(
      <VideoAIMetadata
        isLoading
        metadata={['Some metadata']}
        type={VideoAIMetadataType.LEARNING_OUTCOMES}
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
      <VideoAIMetadata
        isLoading={false}
        metadata={['Some metadata']}
        type={VideoAIMetadataType.LEARNING_OUTCOMES}
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
      <VideoAIMetadata
        isLoading={false}
        metadata={['Some metadata', 'Some other metadata']}
        type={VideoAIMetadataType.LEARNING_OUTCOMES}
      />,
    );

    expect(wrapper.getByText('Some metadata')).toBeVisible();
    expect(wrapper.getByText('Some other metadata')).toBeVisible();
  });

  it('displays an informative message when no metadata loaded', async () => {
    const wrapper = render(
      <>
        <VideoAIMetadata
          isLoading={false}
          metadata={undefined}
          type={VideoAIMetadataType.LEARNING_OUTCOMES}
        />
        <VideoAIMetadata
          isLoading={false}
          metadata={undefined}
          type={VideoAIMetadataType.ASSESSMENT_QUESTIONS}
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
});
