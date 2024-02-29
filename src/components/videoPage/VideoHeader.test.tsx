import { render } from '@testing-library/react';
import { VideoHeader } from 'src/components/videoPage/VideoHeader';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

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

  it('should render video licensing details', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'acc-1', name: 'Ren', products: [Product.B2B] },
      }),
    );
    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Licensing Details')).toBeVisible();
  });

  it('should not render video license duration section if user has LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED flag', () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'acc-1', name: 'Ren', products: [Product.B2B] },
      }),
    );
    client.users.setCurrentUserFeatures({
      LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED: true,
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

  it('should not render licensing details if product is CLASSROOM', () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'acc-1', name: 'Ren', products: [Product.CLASSROOM] },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByText('Licensing Details')).toBeNull();
  });

  it('should not render copy link button if product is CLASSROOM', () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'acc-1', name: 'Ren', products: [Product.CLASSROOM] },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.queryByLabelText('Copy video link')).toBeNull();
  });

  it('should render share video button if product is CLASSROOM', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'acc-1', name: 'Ren', products: [Product.CLASSROOM] },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <VideoHeader video={VideoFactory.sample({})} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByRole('button', { name: 'Share' })).toBeVisible();
  });
});
