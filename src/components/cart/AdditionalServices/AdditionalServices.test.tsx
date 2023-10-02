import { render } from '@testing-library/react';
import React from 'react';
import AdditionalServices from 'src/components/cart/AdditionalServices/AdditionalServices';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { CartItemFactory } from 'boclips-api-client/dist/test-support/CartsFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartValidationProvider } from 'src/components/common/providers/CartValidationProvider';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

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

  it(`should not display trim video or other editing options for users without flags`, async () => {
    const cartItem = CartItemFactory.sample({
      id: 'cart-item-id-1',
      videoId: '123',
    });

    const video = VideoFactory.sample({
      id: '123',
      title: 'this is cart item test',
    });

    const client = new QueryClient();

    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={client}>
          <CartValidationProvider>
            <AdditionalServices videoItem={video} cartItem={cartItem} />
          </CartValidationProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByText(
        'Request human-generated caption and transcript files (in English)',
      ),
    ).toBeVisible();
    expect(await wrapper.queryByText('Trim video')).toBeNull();
    expect(
      await wrapper.queryByText('Request other type of editing'),
    ).toBeNull();
  });

  it(`should display trim video or other editing options for users with flags`, async () => {
    const cartItem = CartItemFactory.sample({
      id: 'cart-item-id-1',
      videoId: '123',
    });

    const video = VideoFactory.sample({
      id: '123',
      title: 'this is cart item test',
    });

    const client = new QueryClient();

    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        features: {
          BO_WEB_APP_REQUEST_TRIMMING: true,
          BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
        },
      }),
    );
    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={client}>
          <CartValidationProvider>
            <AdditionalServices videoItem={video} cartItem={cartItem} />
          </CartValidationProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByText(
        'Request human-generated caption and transcript files (in English)',
      ),
    ).toBeVisible();
    expect(await wrapper.findByText('Trim video')).toBeVisible();
    expect(
      await wrapper.findByText('Request other type of editing'),
    ).toBeVisible();
  });
});
