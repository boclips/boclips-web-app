import { fireEvent, render } from '@testing-library/react';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Router } from 'react-router-dom';
import App from 'src/App';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createBrowserHistory } from 'history';

describe('Sparks landing page', () => {
  it('redirects to the chosen provider explore page', async () => {
    const history = createBrowserHistory();
    history.push('/sparks');

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </Router>,
    );

    expect(await wrapper.findByText('Spark')).toBeVisible();

    fireEvent.click(wrapper.getByText('NGSS'));

    expect(history.location.pathname).toEqual('/explore/ngss');
  });
});
