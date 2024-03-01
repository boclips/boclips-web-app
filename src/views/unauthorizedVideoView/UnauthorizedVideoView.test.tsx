import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import UnauthorizedVideoView from 'src/views/unauthorizedVideoView/UnauthorizedVideoView';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';

describe('Video View', () => {
  it('renders thumbnail', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter initialEntries={['/videos/video-id?referer=id']}>
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    const thumbnail = await wrapper.findByAltText(`${video.title} thumbnail`);

    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail.tagName).toBe('IMG');
    expect(wrapper.queryByText('AI generated')).not.toBeInTheDocument();
    expect(
      wrapper.queryByText('Explore similar videos'),
    ).not.toBeInTheDocument();
  });
});
