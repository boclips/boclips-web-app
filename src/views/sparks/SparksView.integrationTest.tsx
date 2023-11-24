import { fireEvent, render, waitFor } from '@testing-library/react';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';

describe('Sparks landing page', () => {
  it('renders loading skeletons before data is loaded', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.alignments.setProviders([ProviderFactory.sample('ngss')]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => wrapper.getByTestId('Loading details for providers'));

    const loadingSkeleton = await wrapper.findByTestId(
      'Loading details for providers',
    );

    expect(loadingSkeleton).not.toBeNull();
    expect(await wrapper.findByText('NGSS')).toBeVisible();
    expect(loadingSkeleton).not.toBeInTheDocument();
  });

  it('redirects to the chosen provider explore page', async () => {
    const history = createBrowserHistory();
    history.push('/sparks');

    const client = new FakeBoclipsClient();
    client.alignments.setProviders([ProviderFactory.sample('ngss')]);

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App
          apiClient={client}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </Router>,
    );

    expect(await wrapper.findByText('Spark')).toBeVisible();

    fireEvent.click(await wrapper.findByText('NGSS'));

    expect(history.location.pathname).toEqual('/sparks/ngss');
  });

  it('displays Sparks as window title', async () => {
    const client = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks']}>
        <App
          apiClient={client}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Spark')).toBeVisible();

    const helmet = Helmet.peek();

    expect(helmet.title).toEqual('Sparks');
  });
});
