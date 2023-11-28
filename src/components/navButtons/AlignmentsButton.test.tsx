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

  it('pushes sparks page to history when ALIGNMENTS_RENAMING is off', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      ALIGNMENTS_RENAMING: false,
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

  it('pushes alignments page to history when ALIGNMENTS_RENAMING is on', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      ALIGNMENTS_RENAMING: true,
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

    fireEvent.click(await wrapper.findByRole('button', { name: 'Alignments' }));

    expect(history.location.pathname).toEqual('/alignments');
  });
});
