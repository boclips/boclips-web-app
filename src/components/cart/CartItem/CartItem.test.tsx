import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import CartItem from '@components/cart/CartItem/CartItem';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '@components/common/providers/BoclipsSecurityProvider';
import { CartItemFactory } from 'boclips-api-client/dist/test-support/CartsFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartValidationProvider } from '@components/common/providers/CartValidationProvider';
import { Video } from 'boclips-api-client/dist/types';
import { CartItem as CartItemType } from 'boclips-api-client/dist/sub-clients/carts/model/CartItem';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';

describe('CartItem', () => {
  let client: any;

  beforeEach(() => {
    client = new QueryClient();
  });

  function renderCartItem(
    cartItem: React.ReactNode,
    fakeClient: FakeBoclipsClient = new FakeBoclipsClient(),
  ) {
    return render(
      <Router>
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <QueryClientProvider client={client}>
              <CartValidationProvider>{cartItem}</CartValidationProvider>
            </QueryClientProvider>
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>
      </Router>,
    );
  }

  const setupCartItemWithVideo = (
    fakeApiClient: FakeBoclipsClient,
    cartItem: Partial<CartItemType>,
    video: Partial<Video>,
  ) => {
    const fullVideo = VideoFactory.sample(video);
    const fullCartItem = CartItemFactory.sample({
      ...cartItem,
      videoId: fullVideo.id,
    });

    fakeApiClient.videos.insertVideo(fullVideo);
    return fullCartItem;
  };

  it('displays cart item with title and additional services', async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
      BO_WEB_APP_REQUEST_TRIMMING: true,
    });
    const cartItem = setupCartItemWithVideo(
      fakeApiClient,
      CartItemFactory.sample({
        id: 'cart-item-id-1',
      }),
      VideoFactory.sample({
        id: '123',
        title: 'this is cart item test',
      }),
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeApiClient,
    );

    expect(
      await wrapper.findByText('this is cart item test'),
    ).toBeInTheDocument();
    expect(await wrapper.findByText('Additional services')).toBeInTheDocument();
    expect(await wrapper.findByText('Trim video')).toBeInTheDocument();
    expect(
      await wrapper.findByText(
        'Request human-generated caption and transcript files (in English)',
      ),
    ).toBeInTheDocument();
    expect(
      await wrapper.findByText('Request other type of editing'),
    ).toBeInTheDocument();

    // queryBy doesn't throw and error when cannot be found
    expect(wrapper.queryByText(/From:/)).not.toBeInTheDocument();
    expect(wrapper.queryByText(/To:/)).not.toBeInTheDocument();
  });

  it('opens trim video options on when checkbox is checked', async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_TRIMMING: true,
    });
    const cartItem = setupCartItemWithVideo(
      fakeApiClient,
      CartItemFactory.sample({}),
      VideoFactory.sample({}),
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeApiClient,
    );

    fireEvent.click(await wrapper.findByText(/Trim video/));

    expect(wrapper.getByText(/From:/)).toBeInTheDocument();
    expect(wrapper.getByText(/To:/)).toBeInTheDocument();
  });

  it('saves the trim information on onBlur event', async () => {
    const video = VideoFactory.sample({
      id: 'test-video-id',
      title: 'this is cart item test',
    });

    const fakeClient = new FakeBoclipsClient();
    fakeClient.videos.insertVideo(video);
    fakeClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_TRIMMING: true,
    });
    let cart = await fakeClient.carts.getCart();

    const cartItemFromCart = await fakeClient.carts.addItemToCart(
      cart,
      video.id,
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItemFromCart} />,
      fakeClient,
    );

    fireEvent.click(await wrapper.findByText('Trim video'));

    fireEvent.change(await wrapper.findByLabelText('From:'), {
      target: { value: '2:00' },
    });

    fireEvent.change(await wrapper.findByLabelText('To:'), {
      target: { value: '3:00' },
    });

    fireEvent.blur(await wrapper.findByLabelText('From:'));

    cart = await fakeClient.carts.getCart();

    await waitFor(() => {
      expect(cart.items[0].additionalServices?.trim.from).toEqual('2:00');
      expect(cart.items[0].additionalServices?.trim.to).toEqual('3:00');
    });
  });

  it('displays the trim values if cart item has trim info specified', async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_TRIMMING: true,
    });
    const cartItem = setupCartItemWithVideo(
      fakeApiClient,
      CartItemFactory.sample({
        additionalServices: {
          trim: {
            from: '01:21',
            to: '02:21',
          },
        },
      }),
      VideoFactory.sample({}),
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeApiClient,
    );

    expect(
      (await wrapper.findByLabelText('From:')).closest('input').value,
    ).toEqual('01:21');

    expect(wrapper.getByLabelText('To:').closest('input').value).toEqual(
      '02:21',
    );
  });

  it('sets trim to null when trim checkbox is unset', async () => {
    const fakeApiClient = new FakeBoclipsClient();
    fakeApiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_TRIMMING: true,
    });

    const cartItem = setupCartItemWithVideo(
      fakeApiClient,
      CartItemFactory.sample({
        additionalServices: {
          trim: {
            from: '2:00',
            to: '3:00',
          },
        },
      }),
      VideoFactory.sample({}),
    );

    fakeApiClient.carts.insertCartItem(cartItem);

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeApiClient,
    );

    fireEvent.click(await wrapper.findByText('Trim video'));

    expect(wrapper.queryByText(/From:/)).not.toBeInTheDocument();
    expect(wrapper.queryByText(/To:/)).not.toBeInTheDocument();

    const cart = await fakeApiClient.carts.getCart();

    await waitFor(() => {
      expect(cart.items[0].additionalServices.trim).toEqual(null);
    });
  });

  it('sets caption and transcript request to true when checkbox is checked and to false when is unchecked', async () => {
    const fakeClient = new FakeBoclipsClient();

    const cartItem = setupCartItemWithVideo(
      fakeClient,
      CartItemFactory.sample({
        additionalServices: {
          transcriptRequested: false,
        },
      }),
      VideoFactory.sample({}),
    );

    fakeClient.carts.insertCartItem(cartItem);
    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeClient,
    );

    fireEvent.click(
      await wrapper.findByText(
        'Request human-generated caption and transcript files (in English)',
      ),
    );

    let cart = await fakeClient.carts.getCart();

    await waitFor(() => {
      expect(cart.items[0].additionalServices.captionsRequested).toEqual(true);
      expect(cart.items[0].additionalServices.transcriptRequested).toEqual(
        true,
      );
    });

    fireEvent.click(
      await wrapper.findByText(
        'Request human-generated caption and transcript files (in English)',
      ),
    );

    cart = await fakeClient.carts.getCart();

    await waitFor(() => {
      expect(cart.items[0].additionalServices.captionsRequested).toEqual(false);
      expect(cart.items[0].additionalServices.transcriptRequested).toEqual(
        false,
      );
    });
  });

  it('Opens a input box when you tick edit request', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
    });

    const cartItem = setupCartItemWithVideo(
      fakeClient,
      CartItemFactory.sample({}),
      VideoFactory.sample({}),
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeClient,
    );

    fireEvent.click(await wrapper.findByText('Request other type of editing'));

    expect(
      await wrapper.findByPlaceholderText('eg. Remove front and end credits'),
    ).toBeInTheDocument();

    expect(
      await wrapper.findByText('Specify how you’d like to edit the video'),
    ).toBeInTheDocument();
  });

  it('Saves edit request to cart', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
    });

    const cartItem = setupCartItemWithVideo(
      fakeClient,
      CartItemFactory.sample({}),
      VideoFactory.sample({}),
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeClient,
    );

    fireEvent.click(await wrapper.findByText('Request other type of editing'));

    const input = await wrapper.findByPlaceholderText(
      'eg. Remove front and end credits',
    );

    fireEvent.change(input, {
      target: { value: 'please do some lovely editing' },
    });
    const changedInput = await wrapper.findByDisplayValue(
      'please do some lovely editing',
    );

    expect(changedInput).toBeVisible();

    waitFor(async () => {
      const cart = await fakeClient.carts.getCart();
      const updatedCartItem = cart.items.find(
        (it) => it.videoId === cartItem.videoId,
      );
      expect(updatedCartItem?.additionalServices.editRequest).toEqual(
        'please do some lovely editing',
      );
    });
  });

  it('Can set an edit request to null', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({
      BO_WEB_APP_REQUEST_ADDITIONAL_EDITING: true,
    });

    const cartItem = setupCartItemWithVideo(
      fakeClient,
      CartItemFactory.sample({
        additionalServices: {
          editRequest: 'this was a mistake',
        },
      }),
      VideoFactory.sample({}),
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeClient,
    );

    fireEvent.click(await wrapper.findByText('Request other type of editing'));

    waitFor(async () => {
      const input = await wrapper.findByDisplayValue('this was a mistake');
      fireEvent.change(input, {
        target: { value: null },
      });
      const changedInput = await wrapper.findByDisplayValue(
        'eg. Remove front and end credits',
      );

      expect(changedInput).toBeVisible();

      const cart = await fakeClient.carts.getCart();
      const updatedCartItem = cart.items.find(
        (it) => it.videoId === cartItem.videoId,
      );
      expect(updatedCartItem?.additionalServices.editRequest).toBeNull();
    });
  });

  it('sends video removed from cart Hotjar event', async () => {
    const fakeApiClient = new FakeBoclipsClient();
    const hotjarVideoRemovedFromCart = jest.spyOn(
      AnalyticsFactory.hotjar(),
      'event',
    );
    const video = VideoFactory.sample({
      id: '123',
      title: 'this is cart item test',
    });
    const cartItem = setupCartItemWithVideo(
      fakeApiClient,
      CartItemFactory.sample({
        id: 'cart-item-id-1',
        videoId: video.id,
      }),
      video,
    );

    const wrapper = renderCartItem(
      <CartItem cartItem={cartItem} />,
      fakeApiClient,
    );

    const removeFromCartButton = await wrapper.findByText('Remove');

    fireEvent.click(removeFromCartButton);

    await waitFor(() =>
      expect(hotjarVideoRemovedFromCart).toHaveBeenCalledWith(
        HotjarEvents.VideoRemovedFromCart.toString(),
      ),
    );
  });
});
