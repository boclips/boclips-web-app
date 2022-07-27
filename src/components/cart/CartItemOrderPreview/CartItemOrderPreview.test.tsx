import { render } from '@testing-library/react';
import React from 'react';
import { CartItemOrderPreview } from 'src/components/cart/CartItemOrderPreview/CartItemOrderPreview';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Cart Item Preview', () => {
  it('displays correct message when no additional services', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    const cart = {
      items: [
        {
          id: 'cart-item-id',
          videoId: 'video-id',
          additionalServices: {
            trim: null,
            transcriptRequested: false,
            captionsRequested: false,
          },
        },
      ],
    };

    client.setQueryData(['cart'], cart);

    const video = VideoFactory.sample({
      id: 'video-id',
      title: 'this is cart item test',
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <CartItemOrderPreview videos={[video]} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      wrapper.getByText('No additional services selected'),
    ).toBeInTheDocument();
  });

  it('displays correct information based on cart item', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    const cart = {
      items: [
        {
          id: 'cart-item-id',
          videoId: 'video-id',
          additionalServices: {
            trim: { from: '00:00', to: '02:02' },
            transcriptRequested: true,
            captionsRequested: true,
            editRequest: 'bla bla',
          },
        },
      ],
    };

    await fakeClient.carts.addItemToCart(cart, 'video-id');

    client.setQueryData(['cart'], cart);

    const video = VideoFactory.sample({
      id: 'video-id',
      title: 'this is cart item test',
      price: {
        amount: 1000,
        currency: 'USD',
      },
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <CartItemOrderPreview videos={[video]} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText(/(.*)Trim: 00:00 - 02:02/s)).toBeInTheDocument();
    expect(
      wrapper.getByText('English captions and transcripts requested'),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText('Other type of editing: bla bla'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('$1,000')).toBeInTheDocument();
  });
});
