import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import {
  FakeBoclipsClient,
  OrderItemFactory,
  OrdersFactory,
} from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { OrderStatus } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { Link } from 'boclips-api-client/dist/types';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Helmet } from 'react-helmet';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';

describe('OrderView', () => {
  it('loads the no orders view when there are no orders', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('You have no order history... yet!'),
    ).toBeVisible();

    expect(
      wrapper.getByText(
        'But when you order something, you can keep track of all your orders here.',
      ),
    ).toBeInTheDocument();
  });

  it('navigates to order view when view order is clicked', async () => {
    const fakeClient = new FakeBoclipsClient();
    const order = OrdersFactory.sample({
      id: 'look for me',
    });

    fakeClient.orders.insertOrderFixture(order);

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    const button = await wrapper.findByText('View order');
    fireEvent.click(button);
    expect((await wrapper.findAllByText('Order look for me')).length).toEqual(
      2,
    );
  });

  it('loads the order cards', async () => {
    const fakeClient = new FakeBoclipsClient();
    const orders = [
      OrdersFactory.sample({
        id: 'woop-woop-im-an-id',
        deliveredAt: new Date('2021-01-15 14:56:21.800Z'),
        createdAt: new Date('2021-01-10 14:56:21.800Z'),
        status: OrderStatus.DELIVERED,
      }),
      OrdersFactory.sample({
        id: 'me-too!',
        status: OrderStatus.READY,
      }),
    ];

    orders.forEach((v) => fakeClient.orders.insertOrderFixture(v));

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Your Orders')).toBeVisible();
    expect((await wrapper.findAllByText('Order number')).length).toEqual(2);
    expect(await wrapper.findByText('woop-woop-im-an-id')).toBeVisible();
    expect(await wrapper.findByText('me-too!')).toBeVisible();

    expect((await wrapper.findAllByText('Order date')).length).toEqual(2);
    expect(await wrapper.findByText('10/01/21')).toBeVisible();

    expect((await wrapper.findAllByText('Delivery date')).length).toEqual(2);
    expect(await wrapper.findByText('15/01/21')).toBeVisible();

    expect((await wrapper.findAllByText('Total value')).length).toEqual(2);

    expect((await wrapper.findAllByText('Status')).length).toEqual(2);
    expect(await wrapper.findByText('PROCESSING')).toBeVisible();
    expect(await wrapper.findByText('DELIVERED')).toBeVisible();
    expect((await wrapper.findAllByText('View order')).length).toEqual(2);
  });

  it('if there is no deliveryDate it shows a dash', async () => {
    const fakeClient = new FakeBoclipsClient();
    const order = OrdersFactory.sample({
      id: 'woop-woop-im-an-id',
      deliveredAt: null,
    });

    fakeClient.orders.insertOrderFixture(order);

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('-')).toBeVisible();
  });

  it('shows video count', async () => {
    const fakeClient = new FakeBoclipsClient();

    const items = [
      OrderItemFactory.sample({
        id: 'item-1',
        video: OrderItemFactory.sampleVideo({ id: '123' }),
      }),
      OrderItemFactory.sample({
        id: 'item-2',
      }),
    ];
    const order = OrdersFactory.sample({
      id: 'woop-woop-im-an-id',
      deliveredAt: null,
      items,
    });

    fakeClient.orders.insertOrderFixture(order);
    fakeClient.videos.insertVideo(VideoFactory.sample({ id: '123' }));

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('videos')).toBeVisible();
    expect((await wrapper.findByTestId('order-item-count')).innerHTML).toEqual(
      '2',
    );
  });

  it('shows thumbnail from first video in order', async () => {
    const fakeClient = new FakeBoclipsClient();

    const videos = [
      VideoFactory.sample({
        id: '123',
        playback: PlaybackFactory.sample({
          links: {
            thumbnail: new Link({ href: 'https://validThumbnail.com' }),
            createPlayerInteractedWithEvent: new Link({
              href: '',
            }),
          },
        }),
      }),
      VideoFactory.sample({
        id: '234',
        playback: PlaybackFactory.sample({
          links: {
            thumbnail: new Link({ href: 'https://secondThumbnail.com' }),
            createPlayerInteractedWithEvent: new Link({
              href: '',
            }),
          },
        }),
      }),
    ];

    const items = [
      OrderItemFactory.sample({
        id: 'item-1',
        video: OrderItemFactory.sampleVideo({ id: '123' }),
      }),
      OrderItemFactory.sample({
        id: 'item-2',
        video: OrderItemFactory.sampleVideo({ id: '234' }),
      }),
    ];

    const order = OrdersFactory.sample({
      id: 'woop-woop-im-an-id',
      deliveredAt: null,
      items,
    });

    fakeClient.orders.insertOrderFixture(order);
    videos.forEach((video) => fakeClient.videos.insertVideo(video));

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    const thumbnail = await wrapper.findByTestId('order-item-thumbnail');

    await waitFor(() =>
      expect(thumbnail).toHaveStyle(
        'background-image: url(https://validThumbnail.com)',
      ),
    );
  });

  it(`displays access denied if user has BOCLIPS_WEB_APP_BROWSE role`, async () => {
    const fakeClient = new FakeBoclipsClient();
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (role) => role === 'BOCLIPS_WEB_APP_BROWSE',
    };

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={security}
          reactQueryClient={createReactQueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  describe('window titles', () => {
    it('displays Orders as window title', async () => {
      render(
        <MemoryRouter initialEntries={['/orders']}>
          <App
            apiClient={new FakeBoclipsClient()}
            boclipsSecurity={stubBoclipsSecurity}
          />
        </MemoryRouter>,
      );

      const helmet = Helmet.peek();

      await waitFor(() => {
        expect(helmet.title).toEqual('Orders');
      });
    });
  });
});
