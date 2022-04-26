import { render } from '@testing-library/react';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CartOrderSummary } from 'src/components/cart/CartOrderSummary';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  CartItemFactory,
  CartsFactory,
} from 'boclips-api-client/dist/test-support/CartsFactory';
import { CartValidationProvider } from 'src/components/common/providers/CartValidationProvider';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';

describe('Cart Order Summary', () => {
  it('shows pricing for all additional services', async () => {
    window.Environment = {
      PEARSON_ORGANISATION_ID: '123',
    };

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
  });
});
