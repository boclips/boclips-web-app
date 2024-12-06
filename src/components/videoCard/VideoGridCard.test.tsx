import VideoGridCard from '@components/videoCard/VideoGridCard';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import React from 'react';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsSecurityProvider } from '@components/common/providers/BoclipsSecurityProvider';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import dayjs from 'dayjs';

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
      bestFor: [{ label: 'Review' }, { label: 'Synthesis' }],
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

    expect(wrapper.getByText('Review')).toBeInTheDocument();
    expect(wrapper.queryByText('Synthesis')).not.toBeInTheDocument();
  });

  it('should display hours of the duration when duration more than 60 mins', () => {
    const video = VideoFactory.sample({
      createdBy: 'Channel-1',
      channelId: 'channel-1-id',
      bestFor: [{ label: 'Review' }, { label: 'Synthesis' }],
      playback: PlaybackFactory.sample({ duration: dayjs.duration('PT1H36S') }),
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

    expect(wrapper.getByText('1:00:36')).toBeInTheDocument();
  });

  it('displays price in credits', () => {
    const video = VideoFactory.sample({
      createdBy: 'Channel-1',
      channelId: 'channel-1-id',
      bestFor: [{ label: 'Review' }, { label: 'Synthesis' }],
      price: {
        amount: 100,
        currency: 'CREDITS',
      },
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

    const credits = wrapper.getByTestId('credit-price');

    expect(within(credits).getByText('100')).toBeInTheDocument();
  });

  it('should display best for tag description when hovered', async () => {
    const video = VideoFactory.sample({
      createdBy: 'Channel-1',
      channelId: 'channel-1-id',
      bestFor: [{ label: 'Review' }, { label: 'Synthesis' }],
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

    expect(wrapper.getByText('Review')).toBeInTheDocument();
    expect(wrapper.queryByText('Synthesis')).not.toBeInTheDocument();

    await userEvent.hover(
      within(wrapper.getByTestId('tooltip')).getByRole('button'),
    );

    await waitFor(() =>
      expect(wrapper.getByRole('tooltip')).toBeInTheDocument(),
    );
  });
});
