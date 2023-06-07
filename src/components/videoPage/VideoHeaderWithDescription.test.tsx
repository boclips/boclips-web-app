import { render } from '@testing-library/react';
import { VideoHeaderWithDescription } from 'src/components/videoPage/VideoHeaderWithDescription';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('VideoHeaderWithDescription', () => {
  it('should render without crashing if links are null', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeaderWithDescription
            video={VideoFactory.sample({
              title: 'my video title',
              links: null,
            })}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('my video title')).toBeVisible();
  });
  it('should render without crashing if video is null', () => {
    const wrapper = () =>
      render(
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <VideoHeaderWithDescription video={null} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

    expect(wrapper).not.toThrow();
  });
});
