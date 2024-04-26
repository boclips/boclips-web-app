import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  CartItemFactory,
  CartsFactory,
} from 'boclips-api-client/dist/test-support/CartsFactory';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { OrderModal } from 'src/components/orderModal/OrderModal';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

describe('Order Modal', () => {
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

  it('does not show total when pricing is disabled', () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_PRICES: false,
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <Router location={history.location} navigator={history}>
            <OrderModal setModalOpen={jest.fn} videos={[video]} cart={cart} />
          </Router>
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
    const history = createBrowserHistory();

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <Router location={history.location} navigator={history}>
            <OrderModal setModalOpen={jest.fn} videos={[video]} cart={cart} />
          </Router>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Total')).toBeVisible();
  });

  it(`displays license restrictions info when without CTA when BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS is false`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS: false,
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <Router location={history.location} navigator={history}>
            <OrderModal setModalOpen={jest.fn} videos={[video]} cart={cart} />
          </Router>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findByText(
        'Videos have restrictions associated with their license.',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.queryByText(
        'Click on the video title you want to review before checking out.',
      ),
    ).not.toBeInTheDocument();
  });

  it(`doesn't display license restrictions info when without CTA when BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS is true`, () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({
      BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS: true,
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <Router location={history.location} navigator={history}>
            <OrderModal setModalOpen={jest.fn} videos={[video]} cart={cart} />
          </Router>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      wrapper.queryByText(
        'Videos have restrictions associated with their license.',
      ),
    ).not.toBeInTheDocument();
    expect(
      wrapper.queryByText(
        'Click on the video title you want to review before checking out.',
      ),
    ).not.toBeInTheDocument();
  });
});
