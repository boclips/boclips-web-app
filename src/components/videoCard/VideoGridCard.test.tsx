import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';

describe(`VideoGridCard`, () => {
  it('should call onfilterchange when clicking channel name', () => {
    const video = VideoFactory.sample({
      createdBy: 'Channel-1',
      channelId: 'channel-1-id',
    });
    const filterSpy = jest.fn();
    const wrapper = render(
      <Router history={createMemoryHistory()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <VideoGridCard
                video={video}
                onAddToCart={jest.fn()}
                handleFilterChange={filterSpy}
              />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </Router>,
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
      <Router history={createMemoryHistory()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <VideoGridCard video={video} onAddToCart={jest.fn()} />
            </BoclipsSecurityProvider>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </Router>,
    );

    expect(wrapper.getByText('this is a badge')).toBeInTheDocument();
    expect(wrapper.queryByText('this is also a badge')).not.toBeInTheDocument();
  });

  describe(`create embed code button`, () => {
    it(`renders embed code button when user has link and is on openstax page`, () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
          createEmbedCode: new Link({ href: 'embed', templated: false }),
        },
      });

      const wrapper = render(
        <MemoryRouter initialEntries={['/openstax']}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={new FakeBoclipsClient()}>
              <QueryClientProvider client={new QueryClient()}>
                <VideoGridCard video={video} onAddToCart={() => jest.fn()} />
              </QueryClientProvider>
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>
        </MemoryRouter>,
      );

      expect(wrapper.getByRole('button', { name: 'embed' })).toBeVisible();
    });

    it(`doesn't render embed code button when user is not on openstax page`, () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
          createEmbedCode: new Link({ href: 'embed', templated: false }),
        },
      });
      const wrapper = render(
        <MemoryRouter initialEntries={['/videos']}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={new FakeBoclipsClient()}>
              <QueryClientProvider client={new QueryClient()}>
                <VideoGridCard video={video} onAddToCart={() => jest.fn()} />
              </QueryClientProvider>
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>
        </MemoryRouter>,
      );

      expect(wrapper.queryByRole('button', { name: 'embed' })).toBeNull();
    });

    it(`does not render embed code button when user doesn't have link`, () => {
      const video = VideoFactory.sample({
        links: {
          self: new Link({ href: '', templated: false }),
          logInteraction: new Link({ href: '', templated: false }),
        },
      });
      const wrapper = render(
        <MemoryRouter initialEntries={['/explore/openstax/stax-id']}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={new FakeBoclipsClient()}>
              <QueryClientProvider client={new QueryClient()}>
                <VideoGridCard video={video} onAddToCart={() => jest.fn()} />
              </QueryClientProvider>
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>
        </MemoryRouter>,
      );

      expect(wrapper.queryByRole('button', { name: 'embed' })).toBeNull();
    });
  });
});
