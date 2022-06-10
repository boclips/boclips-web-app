import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  CartItemFactory,
  CartsFactory,
} from 'boclips-api-client/dist/test-support/CartsFactory';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { OrderModal } from 'src/components/orderModal/OrderModal';

describe('Order Modal', () => {
  it('does not show total when pricing is disabled', () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_PRICES: false,
    });
    const video = VideoFactory.sample({
      price: { amount: 300, currency: 'USD' },
      id: 'video-id-1',
    });

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
          <OrderModal setModalOpen={jest.fn} videos={[video]} cart={cart} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(wrapper.queryByText('Total')).toBeNull();
  });

  it('shows total when pricing is enabled', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_PRICES: true,
    });
    const video = VideoFactory.sample({
      price: { amount: 300, currency: 'USD' },
      id: 'video-id-1',
    });

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
          <OrderModal setModalOpen={jest.fn} videos={[video]} cart={cart} />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Total')).toBeVisible();
  });
});
