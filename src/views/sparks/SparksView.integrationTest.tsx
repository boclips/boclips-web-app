import { fireEvent, render } from '@testing-library/react';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';

describe('Sparks landing page', () => {
  it('redirects to the chosen provider explore page', async () => {
    const history = createBrowserHistory();
    history.push('/sparks');

    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });

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

    fireEvent.click(wrapper.getByText('NGSS'));

    expect(history.location.pathname).toEqual('/explore/ngss');
  });

  it('displays Sparks as window title', async () => {
    const client = new FakeBoclipsClient();
    client.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });

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
