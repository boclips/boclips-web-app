import { render } from '@testing-library/react';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartOrderSummary } from 'src/components/cart/CartOrderSummary';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  CartItemFactory,
  CartsFactory,
} from 'boclips-api-client/dist/test-support/CartsFactory';
import { CartValidationProvider } from 'src/components/common/providers/CartValidationProvider';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';

describe('Cart Order Summary', () => {
  it('displays copy describing pricing for additional services if selected', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(
      VideoFactory.sample({
        price: { amount: 300, currency: 'USD' },
        id: 'video-id-1',
      }),
    );

    const cart = CartsFactory.sample({
      items: [
        CartItemFactory.sample({
          videoId: 'video-id-1',
          additionalServices: {
            transcriptRequested: true,
            captionsRequested: true,
          },
        }),
      ],
    });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <CartValidationProvider>
            <CartOrderSummary cart={cart} />
          </CartValidationProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.queryByText('Free')).toBeNull();
    expect(
      await wrapper.findByTestId('additional-services-summary'),
    ).toHaveTextContent(
      'Please contact your Account Manager or support@boclips.com for details on potential fees for additional services.',
    );
  });

  it('does not mention additional services pricing if none selected', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.videos.insertVideo(
      VideoFactory.sample({
        price: { amount: 300, currency: 'USD' },
        id: 'video-id-1',
      }),
    );

    const cart = CartsFactory.sample({
      items: [
        CartItemFactory.sample({
          videoId: 'video-id-1',
          additionalServices: {},
        }),
      ],
    });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <CartValidationProvider>
            <CartOrderSummary cart={cart} />
          </CartValidationProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(wrapper.queryByTestId('additional-services-summary')).toBeNull();
  });

  it('does not show totals when pricing is disabled', () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_PRICES: false,
    });
    apiClient.videos.insertVideo(
      VideoFactory.sample({
        price: { amount: 300, currency: 'USD' },
        id: 'video-id-1',
      }),
    );

    const cart = CartsFactory.sample({
      items: [
        CartItemFactory.sample({
          videoId: 'video-id-1',
          additionalServices: {
            transcriptRequested: true,
            captionsRequested: true,
          },
        }),
      ],
    });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <CartValidationProvider>
            <CartOrderSummary cart={cart} />
          </CartValidationProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(wrapper.queryByText('Video(s) total')).toBeNull();
    expect(wrapper.queryByText('Captions and transcripts')).toBeNull();
    expect(wrapper.queryByText('Total')).toBeNull();
  });

  it('shows totals when pricing is enabled', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_PRICES: true,
    });
    apiClient.videos.insertVideo(
      VideoFactory.sample({
        price: { amount: 300, currency: 'USD' },
        id: 'video-id-1',
      }),
    );

    const cart = CartsFactory.sample({
      items: [
        CartItemFactory.sample({
          videoId: 'video-id-1',
          additionalServices: {
            transcriptRequested: true,
            captionsRequested: true,
          },
        }),
      ],
    });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <CartValidationProvider>
            <CartOrderSummary cart={cart} />
          </CartValidationProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Video(s) total')).toBeVisible();
    expect(wrapper.queryByText('Captions and transcripts')).toBeVisible();
    expect(wrapper.queryByText('Total')).toBeVisible();
  });
});
