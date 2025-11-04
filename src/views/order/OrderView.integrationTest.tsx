import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import React from 'react';
import {
  FakeBoclipsClient,
  OrderItemFactory,
  OrdersFactory,
} from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { OrderCaptionStatus } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import { Link } from 'boclips-api-client/dist/types';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { OrderStatus } from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Helmet } from 'react-helmet';

describe('order table', () => {
  it('renders the order header with an id that matches query', async () => {
    const fakeClient = new FakeBoclipsClient();

    const orders = [
      OrdersFactory.sample({ id: 'not-the-id' }),
      OrdersFactory.sample({
        id: 'i-am-the-id',
      }),
    ];

    orders.forEach((order) => fakeClient.orders.insertOrderFixture(order));

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders/i-am-the-id']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const order = await wrapper.findAllByText('Order i-am-the-id');

    expect(order.length).toEqual(2);
    expect(wrapper.getByText('My orders')).toBeVisible();
    expect(wrapper.queryByText('not-the-id')).not.toBeInTheDocument();
  });

  it('renders an order with items with item and their information', async () => {
    const fakeClient = new FakeBoclipsClient();

    const video = VideoFactory.sample({
      id: 'video-id-1',
      price: {
        currency: 'USD',
        amount: 999,
      },
      playback: PlaybackFactory.sample({
        links: {
          thumbnail: new Link({
            href: 'https://url.com',
            templated: true,
          }),
          createPlayerInteractedWithEvent: new Link({
            href: 'player interacted with',
            templated: true,
          }),
        },
      }),
    });

    const item = OrderItemFactory.sample({
      video: {
        title: 'video-1-title',
        id: 'video-id-1',
        captionStatus: OrderCaptionStatus.PROCESSING,
        maxResolutionAvailable: true,
        videoReference: 'video-ref',
        type: 'STOCK',
        allowHumanCaptionRequest: false,
        _links: {
          fullProjection: new Link({ href: 'fullprojection', templated: true }),
          videoUpload: new Link({ href: 'videoUpload', templated: true }),
          captionAdmin: new Link({ href: 'captionAdmin', templated: true }),
        },
      },
      price: {
        displayValue: '$600',
        currency: 'USD',
        value: 600,
      },
    });
    const orders = [
      OrdersFactory.sample({
        id: 'i-am-the-id',
        items: [item],
      }),
    ];

    orders.forEach((order) => fakeClient.orders.insertOrderFixture(order));
    fakeClient.videos.insertVideo(video);

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders/i-am-the-id']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('video-1-title')).toBeVisible();

    await waitFor(() => {
      expect(
        wrapper.getByTestId('order-item-thumbnail').style.backgroundImage,
      ).toEqual('url(https://url.com)');
    });

    expect(await wrapper.findByText('$600')).toBeVisible();
    expect(
      await wrapper.findByText(/[ID:(\n.*?)*)\n\s*\n]video-id-1/),
    ).toBeVisible();
  });

  it('renders order summary', async () => {
    const fakeClient = new FakeBoclipsClient();
    const items = [
      OrderItemFactory.sample({ id: '1' }),
      OrderItemFactory.sample({ id: '2' }),
    ];
    const order = OrdersFactory.sample({
      id: 'order-id',
      createdAt: new Date('2021-02-01 14:56:21.800Z'),
      deliveredAt: new Date('2021-02-03 14:56:21.800Z'),
      status: OrderStatus.READY,
      note: 'i am a note',
      totalPrice: {
        value: 700.5,
        currency: 'USD',
        displayValue: 'USD 700.5',
      },
      items,
    });
    fakeClient.orders.insertOrderFixture(order);
    const wrapper = render(
      <MemoryRouter initialEntries={['/orders/order-id']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Order date')).toBeVisible();
    expect(await wrapper.findByText('Quantity')).toBeVisible();
    expect(await wrapper.findByText('Total value')).toBeVisible();
    expect(await wrapper.findByText('Status')).toBeVisible();
    expect(await wrapper.findByText('Delivery date')).toBeVisible();
    expect(await wrapper.findByText('Notes')).toBeVisible();

    expect(await wrapper.findByText('$700.50')).toBeVisible();
    expect(await wrapper.findByText('01/02/21')).toBeVisible();
    expect(await wrapper.findByText('PROCESSING')).toBeVisible();
    expect(await wrapper.findByText('03/02/21')).toBeVisible();
    expect((await wrapper.findByTestId('video-quantity')).innerHTML).toEqual(
      '2 videos',
    );
    expect(await wrapper.findByText('i am a note')).toBeVisible();
    expect(wrapper.getByText(/Please reach out to/)).toBeVisible();
    expect(
      wrapper.getByText(/if you have any questions pertaining to your order/),
    ).toBeVisible();
  });
  it('does not render notes field if there is no note', async () => {
    const fakeClient = new FakeBoclipsClient();
    const order = OrdersFactory.sample({
      id: 'order-id-no-note',
      note: '',
    });
    fakeClient.orders.insertOrderFixture(order);
    const wrapper = render(
      <MemoryRouter initialEntries={['/orders/order-id-no-note']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Order date')).toBeVisible();
    expect(wrapper.queryByText('Notes')).not.toBeInTheDocument();
  });

  it('video title links to video page', async () => {
    const fakeClient = new FakeBoclipsClient();
    const item = OrderItemFactory.sample({
      video: {
        title: 'linked-video-title',
        id: 'video-id-1',
        captionStatus: OrderCaptionStatus.PROCESSING,
        maxResolutionAvailable: true,
        videoReference: 'video-ref',
        type: 'NEWS',
        allowHumanCaptionRequest: false,
        _links: {
          fullProjection: new Link({ href: 'fullprojection', templated: true }),
          videoUpload: new Link({ href: 'videoUpload', templated: true }),
          captionAdmin: new Link({ href: 'captionAdmin', templated: true }),
        },
      },
      price: {
        displayValue: '$600',
        currency: 'USD',
        value: 600,
      },
    });
    const order = OrdersFactory.sample({
      id: 'order-video-link1',
      items: [item],
    });

    fakeClient.orders.insertOrderFixture(order);
    fakeClient.videos.insertVideo(
      VideoFactory.sample({ title: 'linked-video-title' }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/orders/order-video-link1']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const title = await wrapper.findByText('linked-video-title');

    fireEvent.click(title);

    expect(await wrapper.findByTestId('video-page')).toBeVisible();
  });

  describe('window titles', () => {
    it('displays order id in window title', async () => {
      render(
        <MemoryRouter initialEntries={['/orders/order-123']}>
          <App
            apiClient={new FakeBoclipsClient()}
            boclipsSecurity={stubBoclipsSecurity}
          />
        </MemoryRouter>,
      );

      const helmet = Helmet.peek();

      await waitFor(() => {
        expect(helmet.title).toEqual('Order order-123');
      });
    });
  });
});
