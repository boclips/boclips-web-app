import React from 'react';
import HomeView from '@src/views/home/HomeView';
import { render } from '@testing-library/react';
import { BoclipsSecurityProvider } from '@components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createBrowserHistory } from 'history';

describe('HomeView', () => {
  it('should display toast and then remove it', async () => {
    const history = createBrowserHistory();
    history.push('/?email_verified=true');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <Router location={history.location} navigator={history}>
            <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
              <HomeView />
              <ToastContainer />
            </BoclipsSecurityProvider>
          </Router>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findByText('Email successfully verified'),
    ).toBeInTheDocument();

    expect(window.location.href).toEqual('http://localhost/');
  });
});
