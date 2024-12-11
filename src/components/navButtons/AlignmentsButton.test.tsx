import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '@src/App';
import userEvent from "@testing-library/user-event";

describe('alignments button', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('pushes alignments page to history', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
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

    await userEvent.click(
      await wrapper.findByRole('button', { name: 'Alignments' }),
    );

    expect(history.location.pathname).toEqual('/alignments');
  });
});
