import { render } from '@testing-library/react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { PriceBadge } from '@components/common/price/PriceBadge';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Price } from 'boclips-api-client/dist/sub-clients/videos/model/Price';

describe('PriceBadgeWrapper', () => {
  it('shows a valid price', async () => {
    const video = VideoFactory.sample({
      price: {
        amount: 1,
        currency: 'USD',
      },
    });

    const wrapper = renderBadge(new FakeBoclipsClient(), video.price);

    expect(await wrapper.findByText('$1')).toBeVisible();
  });

  it('shows a credit icon when price is in credits', async () => {
    const video = VideoFactory.sample({
      price: {
        amount: 1,
        currency: 'CREDITS',
      },
    });

    const wrapper = renderBadge(new FakeBoclipsClient(), video.price);

    expect(await wrapper.findByTestId('credit-price')).toBeVisible();
    expect(await wrapper.findByText('1')).toBeVisible();
  });

  it('shows a valid price when the price is 0', async () => {
    const video = VideoFactory.sample({
      price: {
        amount: 0,
        currency: 'USD',
      },
    });

    const wrapper = renderBadge(new FakeBoclipsClient(), video.price);

    expect(await wrapper.findByText('$0')).toBeVisible();
  });

  it('shows a nothing when the video has no price', async () => {
    const price = undefined;
    const wrapper = renderBadge(new FakeBoclipsClient(), price);

    expect(await wrapper.queryByTestId('price-badge')).not.toBeInTheDocument();
  });

  it('shows a price unavailable badge when user is from specified org and video is $0', async () => {
    window.Environment = {
      PEARSON_ACCOUNT_ID: '123',
    };

    const apiClient = new FakeBoclipsClient();
    const user = UserFactory.sample({
      account: {
        ...UserFactory.sample().account,
        id: '123',
        name: 'Specified org',
      },
    });

    apiClient.users.insertCurrentUser(user);

    const video = VideoFactory.sample({
      price: {
        amount: 0,
        currency: 'USD',
      },
    });

    const wrapper = renderBadge(apiClient, video.price);

    expect(await wrapper.findByText('Price unavailable')).toBeVisible();
  });

  it('shows a price unavailable badge when user is from specified org and video has no price', async () => {
    window.Environment = {
      PEARSON_ACCOUNT_ID: '123',
    };

    const apiClient = new FakeBoclipsClient();
    const user = UserFactory.sample({
      account: {
        ...UserFactory.sample().account,
        id: '123',
        name: 'Specified org',
      },
    });

    apiClient.users.insertCurrentUser(user);

    const wrapper = renderBadge(apiClient);

    expect(await wrapper.findByText('Price unavailable')).toBeVisible();
  });

  const renderBadge = (apiClient: FakeBoclipsClient, price?: Price) => {
    return render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <PriceBadge price={price} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );
  };
});
