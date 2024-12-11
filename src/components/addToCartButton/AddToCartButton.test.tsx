import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@src/testSupport/render';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import AddToCartButton from '@components/addToCartButton/AddToCartButton';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import userEvent from "@testing-library/user-event";

describe('Add to cart button', () => {
  const video = VideoFactory.sample({
    title: 'video killed the radio star',
  });

  it('remove label after video added to cart', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <AddToCartButton video={video} />
      </BoclipsClientProvider>,
    );

    const addToCartButton = await wrapper.findByText('Add to cart');

    await userEvent.click(addToCartButton);

    expect(await wrapper.findByText('Remove')).toBeInTheDocument();
  });

  it('sends video added to cart Hotjar event', async () => {
    const apiClient = new FakeBoclipsClient();
    const hotjarVideoAddedToCart = vi.spyOn(AnalyticsFactory.hotjar(), 'event');

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <AddToCartButton video={video} />
      </BoclipsClientProvider>,
    );

    const addToCartButton = await wrapper.findByText('Add to cart');

    await userEvent.click(addToCartButton);

    await waitFor(() =>
      expect(hotjarVideoAddedToCart).toHaveBeenCalledWith(
        HotjarEvents.VideoAddedToCart,
      ),
    );
  });

  it('sends video removed from cart Hotjar event', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.carts.insertCartItem({
      id: 'cart-item-1',
      videoId: video.id,
      links: null,
    });

    const hotjarVideoAddedToCart = vi.spyOn(AnalyticsFactory.hotjar(), 'event');

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <AddToCartButton video={video} />
      </BoclipsClientProvider>,
    );

    const removeFromCartButton = await wrapper.findByText('Remove');

    await userEvent.click(removeFromCartButton);

    await waitFor(() =>
      expect(hotjarVideoAddedToCart).toHaveBeenCalledWith(
        HotjarEvents.VideoRemovedFromCart,
      ),
    );
  });

  it('calls onClick callback when clicked', async () => {
    const apiClient = new FakeBoclipsClient();
    const onClick = vi.fn();

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <AddToCartButton video={video} onClick={onClick} />
      </BoclipsClientProvider>,
    );

    const addToCartButton = await wrapper.findByText('Add to cart');

    await userEvent.click(addToCartButton);

    await waitFor(() => expect(onClick).toHaveBeenCalled());
  });
});
