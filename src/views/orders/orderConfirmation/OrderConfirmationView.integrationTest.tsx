import { render } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { Helmet } from 'react-helmet';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { createBrowserHistory } from 'history';

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
    const history = createBrowserHistory();
    history.push('/order-confirmed', {
      orderLocation: '123',
    });

    const wrapper = render(
      <Router navigator={history} location={history.location}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </Router>,
    );

    expect(await wrapper.findByText('Your order is confirmed')).toBeVisible();
    expect(wrapper.getByTestId('description')).toHaveTextContent(
      'Your order #123 is currently being processed. We’ve sent you an email with your order confirmation.',
    );
  });

  describe('window titles', () => {
    it('displays window title', async () => {
      const history = createBrowserHistory();
      history.push('/order-confirmed', {
        orderLocation: '123',
      });

      const wrapper = render(
        <Router navigator={history} location={history.location}>
          <App
            apiClient={new FakeBoclipsClient()}
            boclipsSecurity={stubBoclipsSecurity}
          />
        </Router>,
      );

      const helmet = Helmet.peek();

      expect(await wrapper.findByText('Your order is confirmed')).toBeVisible();
      expect(helmet.title).toEqual('Order confirmed!');
    });
  });
});
