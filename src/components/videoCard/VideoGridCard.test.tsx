import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe(`VideoGridCard`, () => {
  it('should call onfilterchange when clicking channel name', () => {
    const video = VideoFactory.sample({
      createdBy: 'Channel-1',
      channelId: 'channel-1-id',
    });
    const filterSpy = jest.fn();
    const wrapper = render(
      <MemoryRouter>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <VideoGridCard
                video={video}
                buttonsRow={<div />}
                handleFilterChange={filterSpy}
              />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    fireEvent.click(wrapper.getByText('Channel-1'));

    expect(filterSpy).toHaveBeenCalledWith('channel', ['channel-1-id']);
  });

  it('should display only first badge', () => {
    const video = VideoFactory.sample({
      createdBy: 'Channel-1',
      channelId: 'channel-1-id',
      bestFor: [
        { label: 'this is a badge' },
        { label: 'this is also a badge' },
      ],
    });

    const wrapper = render(
      <MemoryRouter>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <VideoGridCard video={video} buttonsRow={<div />} />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect(wrapper.getByText('this is a badge')).toBeInTheDocument();
    expect(wrapper.queryByText('this is also a badge')).not.toBeInTheDocument();
  });
});
