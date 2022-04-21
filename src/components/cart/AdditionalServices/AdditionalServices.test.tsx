import { render } from '@testing-library/react';
import React from 'react';
import AdditionalServices from 'src/components/cart/AdditionalServices/AdditionalServices';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { CartItemFactory } from 'boclips-api-client/dist/test-support/CartsFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CartValidationProvider } from 'src/components/common/providers/CartValidationProvider';

describe('AdditionalServices component', () => {
  it('should not display a price for all of the services', async () => {
    const cartItem = CartItemFactory.sample({
      id: 'cart-item-id-1',
      videoId: '123',
    });

    const video = VideoFactory.sample({
      id: '123',
      title: 'this is cart item test',
    });

    const client = new QueryClient();

    const renderedElement = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={client}>
          <CartValidationProvider>
            <AdditionalServices videoItem={video} cartItem={cartItem} />
          </CartValidationProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(await renderedElement.queryByText('Free')).toBeNull();
  });
});
