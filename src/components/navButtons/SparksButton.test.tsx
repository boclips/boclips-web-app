import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import App from 'src/App';

describe('sparks button', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('pushes sparks page to history', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      BO_WEB_APP_SPARKS: true,
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router location={history.location} navigator={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    fireEvent.click(await wrapper.findByRole('button', { name: 'Sparks' }));

    expect(history.location.pathname).toEqual('/sparks');
  });
});
