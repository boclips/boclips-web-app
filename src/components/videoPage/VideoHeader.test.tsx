import { render } from '@testing-library/react';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('VideoHeader', () => {
  it('should render without crashing if links are null', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader
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
            <VideoHeader video={null} />
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

    expect(wrapper).not.toThrow();
  });

  it('should render video licensing details if user has the feature flag', async () => {
    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_LICENSING_DETAILS: true,
    });

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Licensing Details')).toBeVisible();
  });

  it('should not render video licensing details if user does not have the feature flag', async () => {
    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({
      BO_WEB_APP_LICENSING_DETAILS: false,
    });

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Licensing Details')).toBeNull();
  });

  it('should not render video license duration badge if user has BO_WEB_APP_LICENSING_DETAILS flag', () => {
    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({ BO_WEB_APP_LICENSING_DETAILS: true });

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Can be licensed', { exact: false })).toBeNull();
  });

  it('should not render video license duration badge if user has LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED flag', () => {
    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({
      LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED: true,
      BO_WEB_APP_LICENSING_DETAILS: false,
    });

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Can be licensed', { exact: false })).toBeNull();
  });

  it('should not render video license duration section if user has LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED flag', () => {
    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({
      LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED: true,
      BO_WEB_APP_LICENSING_DETAILS: true,
    });

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Licensing Details')).toBeNull();
  });
});
