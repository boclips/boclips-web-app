import { render } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from 'src/App';

describe('OrderConfirmationView', () => {
  it('redirects to main page when no orderLocation', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/order-confirmed']}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Loading')).toBeVisible();
    expect(
      await wrapper.findByText('Let’s find the videos you need'),
    ).toBeVisible();
  });

  it('displays confirmation page', async () => {
    window.history.pushState(
      {
        state: {
          orderLocation: '123',
        },
      },
      'Test page title',
      '/order-confirmed',
    );
    const wrapper = render(
      <App
        apiClient={new FakeBoclipsClient()}
        boclipsSecurity={stubBoclipsSecurity}
      />,
      {
        wrapper: BrowserRouter,
      },
    );

    expect(await wrapper.findByText('Your order is confirmed')).toBeVisible();
    expect(wrapper.getByTestId('description').textContent).toEqual(
      'Your order #123 is currently being processed. We’ve sent you an email with your order confirmation.',
    );
  });

  describe('window titles', () => {
    it('displays window title', async () => {
      window.history.pushState(
        {
          state: {
            orderLocation: '123',
          },
        },
        'Test page title',
        '/order-confirmed',
      );

      const wrapper = render(
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />,
        {
          wrapper: BrowserRouter,
        },
      );

      const helmet = Helmet.peek();

      expect(await wrapper.findByText('Your order is confirmed')).toBeVisible();
      expect(helmet.title).toEqual('Order confirmed!');
    });
  });
});
