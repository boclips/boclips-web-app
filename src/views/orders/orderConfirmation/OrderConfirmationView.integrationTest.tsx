import { render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { Helmet } from 'react-helmet';
import { MemoryRouter, Router } from 'react-router-dom';
import App from '@src/App';
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
    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to Boclips Library',
    );
  });

  it('displays confirmation page when BO_WEB_APP is false', async () => {
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
    expect(wrapper.getByTestId('more-description')).toHaveTextContent(
      'You can track and review all orders in your account.',
    );
  });

  it('displays confirmation page when BO_WEB_APP is true', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });

    const history = createBrowserHistory();
    history.push('/order-confirmed', {
      orderLocation: '456',
    });

    const wrapper = render(
      <Router navigator={history} location={history.location}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    expect(await wrapper.findByText('Your order is confirmed')).toBeVisible();
    expect(wrapper.getByTestId('description')).toHaveTextContent(
      'Your order #456 is currently being processed. We’ve sent you an email with your order confirmation.',
    );
    await waitFor(() => {
      expect(wrapper.getByTestId('more-description')).toHaveTextContent(
        'You can track and review all orders in your account. ' +
          'You can view and retrieve all purchased videos in your Content area once your order has been processed ' +
          'and your content license generated.',
      );
    });
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
