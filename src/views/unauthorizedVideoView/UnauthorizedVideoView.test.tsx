import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import UnauthorizedVideoView from '@src/views/unauthorizedVideoView/UnauthorizedVideoView';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';

describe('Video View', () => {
  it('should display the video when referer is correct', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);
    apiClient.videos.addValidReferer('referer-id');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter
            initialEntries={['/videos/shared/video-id?referer=referer-id']}
          >
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('NATO')).toBeVisible();
  });

  it('should display not found when referer is invalid', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);
    apiClient.videos.addValidReferer('referer-id');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter
            initialEntries={[
              '/videos/shared/video-id?referer=another-referer-id',
            ]}
          >
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('should display not found when referer is not provided', async () => {
    const video = VideoFactory.sample({ id: 'video-id', title: 'NATO' });
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(video);
    apiClient.videos.addValidReferer('referer-id');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <MemoryRouter initialEntries={['/videos/shared/video-id']}>
            <UnauthorizedVideoView />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });
});
